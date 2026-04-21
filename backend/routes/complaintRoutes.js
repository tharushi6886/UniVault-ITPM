const express = require("express");
const router = express.Router();
const {
  submitComplaint,
  getMyComplaints,
  getComplaintById,
  getAllComplaints,
  updateComplaintStatus,
  getComplaintsAgainstMe,
  replyToComplaint,
  buyerReplyToComplaint,
  sendComplaintMessage,
  editComplaintMessage,
  deleteComplaintMessage,
} = require("../controllers/complaintController");
const { protect } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

router.post("/", protect, submitComplaint);
router.get("/my", protect, getMyComplaints);
router.get("/against-me", protect, getComplaintsAgainstMe);
router.post("/:id/reply", protect, replyToComplaint);
router.post("/:id/buyer-reply", protect, buyerReplyToComplaint);
router.post("/:id/message", protect, sendComplaintMessage);
router.patch("/:id/message/:msgId", protect, editComplaintMessage);
router.delete("/:id/message/:msgId", protect, deleteComplaintMessage);
router.get("/admin/all", protect, authorizeRoles("Admin"), getAllComplaints);
router.patch("/admin/:id/status", protect, authorizeRoles("Admin"), updateComplaintStatus);
router.get("/:id", protect, getComplaintById);

module.exports = router;
