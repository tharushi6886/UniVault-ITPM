const express = require("express");
const router = express.Router();
const {
  createPurchase,
  getMyPurchases,
  getAllPurchases,
  updatePurchaseStatus,
} = require("../controllers/purchaseController");
const uploadReceipt = require("../utils/uploadReceipt");

router.post("/", uploadReceipt.single("receipt"), createPurchase);
router.get("/my-purchases", getMyPurchases);
router.get("/", getAllPurchases);
router.patch("/:id/status", updatePurchaseStatus);

module.exports = router;
