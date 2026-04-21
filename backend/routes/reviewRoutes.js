const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  createReview,
  getReviewsForUser,
  getMyGivenReviews,
  getMyReceivedReviews,
  getPendingReviews,
  deleteReview,
} = require("../controllers/reviewController");

// Public: anyone can view reviews for a user
router.get("/user/:userId", getReviewsForUser);

// Protected routes
router.use(protect);
router.post("/", createReview);
router.get("/my-given", getMyGivenReviews);
router.get("/received", getMyReceivedReviews);
router.get("/pending", getPendingReviews);
router.delete("/:id", deleteReview);

module.exports = router;
