const User = require("../models/User");
const LostItem = require("../models/LostItem");
const FoundItem = require("../models/FoundItem");
const generateToken = require("../utils/generateToken");
const nodemailer = require("nodemailer");
const Lost = require("../models/lost");
const Item = require("../models/itemModels");
const calculateTrustScore = require("../utils/trustScore");
const syncUserTrust = require("../utils/reputationSync");

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
      // Validate environment variables
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("Email environment variables not configured");
        await User.findByIdAndDelete(user._id);
        return res.status(500).json({
          message: "Email service not configured. Please try again later.",
        });
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER, 
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      // Verify transporter connection
      await transporter.verify();

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "UniVault OTP Verification",
        html: `
          <h2>UniVault OTP Verification</h2>
          <p>Your OTP code is: <strong>${otp}</strong></p>
          <p>This code will expire in 10 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`OTP email sent successfully to ${email}`);
    } catch (mailError) {
      console.error("Email sending error:", mailError.message);
      await User.findByIdAndDelete(user._id);

      return res.status(500).json({
        message: "Failed to send OTP email. Please check your email address and try again.",
        error: process.env.NODE_ENV === "development" ? mailError.message : undefined,
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
    
    // Award verification points immediately
    await syncUserTrust(user._id);

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
      // Use the centralized utility for all trust calculations
      const trustData = await calculateTrustScore(user._id);

      if (!trustData) {
        return res.status(500).json({ message: "Error calculating trust score" });
      }

      const trust = {
        level: trustData.status,
        rating: trustData.totalScore + "/100",
        feedbackSummary: trustData.totalScore >= 80 ? "Highly reliable and trusted campus user" : trustData.totalScore >= 40 ? "Regular and verified campus user" : "New or unverified member",
        buyerFeedback: trustData.stats.itemsSold > 0 ? "Positive transaction history" : "No recent transactions",
        sellerFeedback: trustData.stats.itemsSold > 0 ? "Reliable seller" : "No recent transactions",
        recoveryTrust: trustData.stats.foundReturned > 0 ? "Proven helper in Lost & Found" : "No recoveries yet",
        communityScore: trustData.totalScore >= 60 ? "Active member with good standing" : "Building community trust"
      };

      res.json({
        ...user.toObject(),
        stats: {
          ...trustData.stats,
          ...trustData, // Include pillars, milestones, lastAudit, etc.
          buySellHistory: 0,
          myBids: 0,
          trustScore: trustData.totalScore,
          trustLevel: trustData.status,
          trustBreakdown: Object.entries(trustData.pillars || {}).map(([name, data]) => ({ name, ...data }))
        },
        trust
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Public Profile (For reviewing/viewing other users)
const getPublicProfile = async (req, res) => {
  try {
    // Only select non-sensitive public info
    const user = await User.findById(req.params.id).select("name profileImage faculty studentId role");
    
    if (user) {
      const trustData = await calculateTrustScore(user._id);
      
      const trust = trustData ? {
        level: trustData.status,
        rating: trustData.totalScore + "/100"
      } : { level: "Unranked", rating: "0/100" };

      res.json({
        ...user.toObject(),
        stats: trustData ? {
          ...trustData.stats,
          trustScore: trustData.totalScore,
          trustLevel: trustData.status
        } : {},
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
      
      // Update trust score for profile integrity changes
      await syncUserTrust(user._id);

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
    const [
      totalUsers, 
      activeUsers, 
      pendingUsers, 
      blockedUsers, 
      adminUsers, 
      studentUsers,
      newLostCount,
      oldLostCount,
      totalFoundItems,
      totalMarketplaceItems
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: "active" }),
      User.countDocuments({ status: "pending" }),
      User.countDocuments({ status: "blocked" }),
      User.countDocuments({ role: "Admin" }),
      User.countDocuments({ role: "Student" }),
      LostItem.countDocuments(),
      Lost.countDocuments(),
      FoundItem.countDocuments(),
      Item.countDocuments()
    ]);

    const totalLostItems = newLostCount + oldLostCount;

    res.json({
      totalUsers,
      activeUsers,
      pendingUsers,
      blockedUsers,
      adminUsers,
      studentUsers,
      totalLostItems,
      totalFoundItems,
      totalMarketplaceItems,
      totalBids: 0,
      pendingClaims: 0,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Public System Stats (Homepage)
const getPublicSystemStats = async (req, res) => {
  try {
    const [
      studentsCount,
      marketplaceListingsCount,
      lostItemsCount,
      oldLostItemsCount,
      foundItemsCount,
      resolvedLostCount,
      resolvedFoundCount
    ] = await Promise.all([
      User.countDocuments({ role: "Student", status: "active" }),
      Item.countDocuments({ availability_status: "available" }), 
      LostItem.countDocuments({ status: "active" }),
      Lost.countDocuments({ status: "active" }),
      FoundItem.countDocuments({ status: "available" }), 
      LostItem.countDocuments({ status: "resolved" }),
      FoundItem.countDocuments({ status: "resolved" }) 
    ]);

    const activeReports = lostItemsCount + oldLostItemsCount + foundItemsCount;
    const itemsRecovered = resolvedLostCount + resolvedFoundCount;

    res.json({
      studentsCount,
      itemsRecovered,
      marketplaceListingsCount,
      activeReports
    });
  } catch (error) {
    console.error("Public stats error:", error);
    res.status(500).json({ message: "Failed to load system stats" });
  }
};

// Get Trust Leaderboard (Homepage)
const getTrustLeaderboard = async (req, res) => {
  try {
    // 1. Fetch top users by trustScore directly (Super fast due to index)
    const topUsers = await User.find({ status: "active" })
      .sort({ trustScore: -1, createdAt: 1 })
      .limit(3)
      .select("_id name studentId profileImage faculty trustScore trustLevel");

    // 2. Fetch fresh stats for these top users to ensure labels are perfect
    const leaderboardScores = await Promise.all(
      topUsers.map(async (user) => {
        // We still fetch fresh calculation to get the 'stats' like itemsRecovered
        const trustData = await calculateTrustScore(user._id);
        return {
          id: user._id,
          name: user.name,
          studentId: user.studentId,
          profileImage: user.profileImage,
          faculty: user.faculty,
          trustScore: trustData?.totalScore || 0,
          trustLevel: trustData?.status || "Improving",
          itemsRecovered: trustData?.stats?.foundReturned || 0
        };
      })
    );

    res.json(leaderboardScores);
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
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
      
      // Sync trust score for avatar update
      await syncUserTrust(user._id);

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

// Get User Trust Score by Student ID
const getUserTrustByStudentId = async (req, res) => {
  try {
    const user = await User.findOne({ studentId: req.params.studentId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const trustData = await calculateTrustScore(user._id);
    res.json({
      studentId: user.studentId,
      totalScore: trustData.totalScore,
      status: trustData.status,
      pillars: trustData.pillars,
      stats: trustData.stats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  verifyOtp,
  loginUser,
  getUserProfile,
  getPublicProfile,
  updateUserProfile,
  changePassword,
  getUsers,
  getUserById,
  blockUser,
  deleteUser,
  unblockUser,
  getAdminDashboardStats,
  getPublicSystemStats,
  getTrustLeaderboard,
  syncUserTrust,
  forgotPassword,
  resetPassword,
  updateUserRole,
  uploadAvatar,
  getUserTrustByStudentId,
};