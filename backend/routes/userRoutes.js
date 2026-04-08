const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");

const {
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
  forgotPassword,
  resetPassword,
  updateUserRole,
  uploadAvatar,
} = require("../controllers/userController");

const upload = require("../middlewares/uploadMiddleware");

const { protect } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");
const {
  registerValidation,
  loginValidation,
} = require("../validations/userValidation");

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  next();
};

// Auth
router.post("/register", registerValidation, validate, registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginValidation, validate, loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// User profile
router.get("/profile", protect, getUserProfile);
router.get("/public/:id", getPublicProfile);
router.put("/profile", protect, updateUserProfile);
router.put("/change-password", protect, changePassword);
router.put("/profile/avatar", protect, upload.single("avatar"), uploadAvatar);

// Admin
router.get("/admin/dashboard-stats", protect, authorizeRoles("Admin"), getAdminDashboardStats);
router.get("/", protect, authorizeRoles("Admin"), getUsers);
router.get("/:id", protect, authorizeRoles("Admin"), getUserById);
router.put("/:id/block", protect, authorizeRoles("Admin"), blockUser);
router.delete("/:id", protect, authorizeRoles("Admin"), deleteUser);
router.put("/:id/unblock", protect, authorizeRoles("Admin"), unblockUser);
router.put("/:id/role", protect, authorizeRoles("Admin"), updateUserRole);

module.exports = router;