const User = require("../Models/User");
const generateToken = require("../utils/generateToken");

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, studentId, password, phone, faculty } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { studentId }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email or student ID",
      });
    }

    const user = await User.create({
      name,
      email,
      studentId,
      password,
      role: "Student",
      phone,
      faculty,
    });

    res.status(201).json({
      message: "User registered successfully",
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
    console.error("Register error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp || (user.otpExpires && user.otpExpires < Date.now())) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.status = "active";
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "OTP verified successfully, account active." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
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