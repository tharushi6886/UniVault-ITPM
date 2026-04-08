const Review = require("../models/Review");
const User = require("../models/User");

// POST /api/reviews
// Create a new review. Auth required. Cannot review yourself.
const createReview = async (req, res) => {
  try {
    const reviewer = req.user._id;
    const { reviewedUserId, rating, comment, interactionType } = req.body;

    // Guard: cannot review yourself
    if (reviewer.toString() === reviewedUserId) {
      return res.status(400).json({ message: "You cannot review yourself." });
    }

    // Guard: reviewed user must exist
    const reviewedUser = await User.findById(reviewedUserId);
    if (!reviewedUser) {
      return res.status(404).json({ message: "User to review not found." });
    }

    // Guard: rating range
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }

    // Guard: valid interaction type
    const allowedTypes = ["marketplace", "lost_found", "bidding", "general"];
    if (!allowedTypes.includes(interactionType)) {
      return res.status(400).json({ message: "Invalid interaction type." });
    }

    // Attempt to create (unique index will reject duplicates)
    const review = await Review.create({
      reviewer,
      reviewed: reviewedUserId,
      rating,
      comment: comment?.trim() || "",
      interactionType,
    });

    await review.populate("reviewer", "name profileImage");

    return res.status(201).json({ message: "Review submitted successfully.", review });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "You have already reviewed this user for this interaction type.",
      });
    }
    console.error("createReview error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// GET /api/reviews/user/:userId
// Fetch all reviews for a user, latest first, with reviewer populated
const getReviewsForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({ reviewed: userId })
      .populate("reviewer", "name profileImage studentId")
      .sort({ createdAt: -1 });

    // Compute average rating
    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : null;

    return res.status(200).json({ reviews, avgRating, total: reviews.length });
  } catch (err) {
    console.error("getReviewsForUser error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// GET /api/reviews/my-given
// Reviews the logged-in user has written
const getMyGivenReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewer: req.user._id })
      .populate("reviewed", "name profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json({ reviews });
  } catch (err) {
    console.error("getMyGivenReviews error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// DELETE /api/reviews/:id
// Only the reviewer can delete their own review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found." });

    if (review.reviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this review." });
    }

    await review.deleteOne();
    return res.status(200).json({ message: "Review deleted." });
  } catch (err) {
    console.error("deleteReview error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = { createReview, getReviewsForUser, getMyGivenReviews, deleteReview };
