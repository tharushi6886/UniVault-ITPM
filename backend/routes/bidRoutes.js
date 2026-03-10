const express = require("express");
const router = express.Router();
const {
  createBid,
  getBids,
  getBidById,
  updateBid,
  deleteBid,
  approveBid,
  rejectBid,
  getMyBids,
} = require("../controllers/bidController");
const { protect } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

router.get("/my-bids", protect, getMyBids);

router.get("/", protect, authorizeRoles("Admin"), getBids);
router.post("/", protect, createBid);

router.get("/:id", protect, getBidById);
router.put("/:id", protect, updateBid);
router.delete("/:id", protect, deleteBid);

router.patch("/:id/approve", protect, authorizeRoles("Admin"), approveBid);
router.patch("/:id/reject", protect, authorizeRoles("Admin"), rejectBid);

module.exports = router;
