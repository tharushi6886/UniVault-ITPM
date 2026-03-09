const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");

const {
  registerUser,
  verifyOtp,
  loginUser,
  getUserProfile,
  getUsers,
  updateUserProfile,
  deleteUser,
  changePassword,
  blockUser,
  getUserById,
} = require("../controllers/userController");

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

// Auth routes
router.post("/register", registerValidation, validate, registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginValidation, validate, loginUser);

// User routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.put("/change-password", protect, changePassword);

// Admin routes
router.get("/", protect, authorizeRoles("Admin"), getUsers);
router.put("/block/:id", protect, authorizeRoles("Admin"), blockUser);
router.delete("/:id", protect, authorizeRoles("Admin"), deleteUser);
router.get("/:id", protect, authorizeRoles("Admin"), getUserById);

module.exports = router;