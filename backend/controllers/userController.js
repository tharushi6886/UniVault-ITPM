const User = require("../Models/User");
const generateToken = require("../utils/generateToken");
const nodemailer = require("nodemailer");

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, studentId, password, phone, faculty } = req.body;

    if (!email.endsWith("@my.sliit.lk")) {
      return res.status(400).json({
        message: "Only @my.sliit.lk email addresses are allowed",
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
      res.json(user);
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

    res.json({
      totalUsers,
      activeUsers,
      pendingUsers,
      blockedUsers,
      adminUsers,
      studentUsers,

      // placeholders for other modules for now
      totalLostItems: 0,
      totalFoundItems: 0,
      totalMarketplaceItems: 0,
      totalBids: 0,
      pendingClaims: 0,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
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
};