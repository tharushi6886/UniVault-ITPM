const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const orderController = require("../controllers/orderController");
const { protect } = require("../middlewares/authMiddleware");

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// POST create order
router.post("/", protect, upload.single("receipt"), orderController.createOrder);

// GET seller orders
router.get("/seller", protect, orderController.getSellerOrders);

// PUT update order status
router.put("/:id/status", protect, orderController.updateOrderStatus);

module.exports = router;
