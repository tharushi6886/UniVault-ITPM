const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  createBidItem, getMyBidItems, getAllBidItems, updateBidItemStatus, deleteBidItem,
} = require("../controllers/bidItemController");

router.get("/", getAllBidItems);
router.post("/", protect, createBidItem);
router.get("/my", protect, getMyBidItems);
router.patch("/:id/status", protect, updateBidItemStatus);
router.delete("/:id", protect, deleteBidItem);

module.exports = router;
