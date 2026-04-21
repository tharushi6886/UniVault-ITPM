const express = require("express");
const router = express.Router();
const {
  placeBid,
  getMyBids,
  getReceivedBids,
  getBidsForItem,
  updateBidStatus,
  getAllBidsAdmin,
} = require("../controllers/bidController");
const { protect } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

router.post("/", protect, placeBid);
router.get("/my", protect, getMyBids);
router.get("/received", protect, getReceivedBids);
router.get("/admin/all", protect, authorizeRoles("Admin"), getAllBidsAdmin);
router.get("/item/:itemId", protect, getBidsForItem);
router.patch("/:id/status", protect, updateBidStatus);

module.exports = router;
