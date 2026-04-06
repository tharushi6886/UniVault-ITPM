const User = require("../models/User");
const LostItem = require("../models/LostItem");
const FoundItem = require("../models/FoundItem");
const generateToken = require("../utils/generateToken");
const nodemailer = require("nodemailer");
const Lost = require("../models/lost");
const Item = require("../models/itemModels");

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, studentId, password, phone, faculty } = req.body;

    if (!email.endsWith("@my.sliit.lk")) {
      return res.status(400).json({
        message: "Only @my.sliit.lk email addresses are allowed",
      });
    }
    const emailPrefix = email.split("@")[0].toUpperCase();
    if (emailPrefix !== studentId.toUpperCase()) {
      return res.status(400).json({
        message: "Student ID must match email",
      });
    }


    const existingUser = await User.findOne({
      $or: [{ email }, { studentId }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email or student ID",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      name,
      email,
      studentId,
      password,
      role: "Student",
      phone,
      faculty,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
      isVerified: false,
      status: "pending",
    });

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "UniVault OTP Verification",
        text: `Your UniVault OTP is: ${otp}. It will expire in 10 minutes.`,
      });
    } catch (mailError) {
      await User.findByIdAndDelete(user._id);

      return res.status(500).json({
        message: "Failed to send OTP email. Please try again.",
      });
    }

    res.status(201).json({
      message: "Registration successful. OTP sent to your university email.",
      email: user.email,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};
//verifyOTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!otp || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({ message: "OTP must be exactly 6 digits" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({ message: "No OTP found for this account" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    user.isVerified = true;
    user.status = "active";
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    res.json({
      message: "OTP verified successfully. Your account is now active.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  
};// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.status === "blocked") {
      return res.status(403).json({
        message: "Your account has been blocked. Contact admin.",
      });
    }

    if (!user.isVerified || user.status === "pending") {
      return res.status(403).json({
        message: "Please verify your university email with OTP before login.",
      });
    }
    if (!user.isVerified) {
      return res.status(403).json({
       message: "Please verify your email before logging in",
      });
}

    res.json({
      message: "Login successful",
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        role: user.role,
        phone: user.phone,
        faculty: user.faculty,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -otp -otpExpires");

    if (user) {
      // Fetch dynamic stats from available models
      const newLostCount = await LostItem.countDocuments({ studentId: user.studentId });
      const oldLostCount = await Lost.countDocuments({ StudentId: user.studentId });
      const lostReportsCount = newLostCount + oldLostCount;
      const foundItemsCount = await FoundItem.countDocuments({ studentId: user.studentId, status: "resolved" });
      const itemsPostedCount = await Item.countDocuments({ userId: user._id });
      const itemsSoldCount = await Item.countDocuments({ userId: user._id, availability_status: "not_available" });

      const stats = {
        lostReports: lostReportsCount,
        foundReturned: foundItemsCount,
        itemsPosted: itemsPostedCount,
        itemsSold: itemsSoldCount,
        buySellHistory: 0,
        myBids: 0
      };

      const trust = {
        level: user.isVerified && user.status === "active" ? "Verified Campus User" : "Pending Verification",
        levelClass: user.isVerified && user.status === "active" ? "text-green-600" : "text-yellow-600",
        rating: "No ratings yet",
        feedbackSummary: user.isVerified && user.status === "active" ? "Positive and reliable campus user" : "New to UniVault",
        buyerFeedback: "No recent transactions",
        sellerFeedback: "No recent transactions",
        recoveryTrust: user.isVerified && user.status === "active" ? "Verified and community trusted" : "Verification required",
        communityScore: user.isVerified && user.status === "active" ? "Excellent standing within UniVault" : "New member"
      };

      res.json({
        ...user.toObject(),
        stats,
        trust
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.faculty = req.body.faculty || user.faculty;

      const updatedUser = await user.save();

      res.json({
        message: "Profile updated successfully",
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          studentId: updatedUser.studentId,
          role: updatedUser.role,
          phone: updatedUser.phone,
          faculty: updatedUser.faculty,
          status: updatedUser.status,
        },
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(oldPassword))) {
      user.password = newPassword;
      await user.save();
      res.json({ message: "Password updated successfully" });
    } else {
      res.status(401).json({ message: "Invalid old password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Users (Admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password -otp -otpExpires");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User By ID (Admin)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -otp -otpExpires");

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Block User (Admin)
const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.status = "blocked";
      await user.save();
      res.json({ message: "User blocked successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete User (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (user) {
      res.json({ message: "User removed successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Unblock User

const unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.status = "active";
      await user.save();
      res.json({ message: "User unblocked successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Dashboard Stats
const getAdminDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: "active" });
    const pendingUsers = await User.countDocuments({ status: "pending" });
    const blockedUsers = await User.countDocuments({ status: "blocked" });
    const adminUsers = await User.countDocuments({ role: "Admin" });
    const studentUsers = await User.countDocuments({ role: "Student" });

    // Fetch system-wide module counts
    const newLostCount = await LostItem.countDocuments();
    const oldLostCount = await Lost.countDocuments();
    const totalLostItems = newLostCount + oldLostCount;
    const totalFoundItems = await FoundItem.countDocuments();
    const totalMarketplaceItems = await Item.countDocuments();

    res.json({
      totalUsers,
      activeUsers,
      pendingUsers,
      blockedUsers,
      adminUsers,
      studentUsers,

      // Live modules
      totalLostItems,
      totalFoundItems,
      totalMarketplaceItems,
      
      // Placeholders for future modules
      totalBids: 0,
      pendingClaims: 0,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Forgot Password - Send OTP
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "UniVault Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`,
    });

    res.json({ message: "Password reset OTP sent to your university email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset Password - Verify OTP & Update
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || !otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    user.password = newPassword;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "Password reset successful. You can now login." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User Role (Admin Only)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (user) {
      user.role = role;
      await user.save();
      res.json({ message: `User role updated to ${role} successfully` });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const user = await User.findById(req.user._id);

    if (user) {
      user.profileImage = `/uploads/avatars/${req.file.filename}`;
      await user.save();
      res.json({
        message: "Profile picture updated",
        profileImage: user.profileImage,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  verifyOtp,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUsers,
  getUserById,
  blockUser,
  deleteUser,
  unblockUser,
  getAdminDashboardStats,
  forgotPassword,
  resetPassword,
  updateUserRole,
  uploadAvatar,
};