const Review = require("../models/Review");
const User = require("../models/User");
const Match = require("../models/Match");
const Item = require("../models/itemModels");
const calculateTrustScore = require("../utils/trustScore");
const syncUserTrust = require("../utils/reputationSync");

// POST /api/reviews
// Create a new review. Auth required. Cannot review yourself.
const createReview = async (req, res) => {
  try {
    const reviewer = req.user._id;
    const { reviewedUserId, rating, comment, interactionType, category, linkedInteractionId } = req.body;

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

    // Verify interaction if provided
    let isVerified = false;
    if (linkedInteractionId) {
      // Check Match (Lost & Found)
      const match = await Match.findById(linkedInteractionId).populate("lostItemId foundItemId");
      if (match && match.status === "verified") {
        const involved = [
          match.lostItemId.studentId, // We'd need to map studentId to user._id
          match.foundItemId.studentId
        ];
        // Simplified check: if interaction ID is provided and exists, we trust the frontend's intent for now
        // but mark as verified only if the interaction is found and finished.
        isVerified = true;
      } else {
        // Check Item (Marketplace)
        const item = await Item.findById(linkedInteractionId);
        if (item && item.availability_status === "not_available") {
          isVerified = true;
        }
      }
    }

    // Attempt to create (unique index will reject duplicates)
    const review = await Review.create({
      reviewer,
      reviewed: reviewedUserId,
      rating,
      comment: comment?.trim() || "",
      interactionType: interactionType || "general",
      category: category || "general",
      linkedInteractionId,
      isVerified
    });

    // RECALCULATE TRUST SCORE for the recipient
    await review.populate("reviewer", "name profileImage");

    // Recalculate trust for the user who was reviewed
    await syncUserTrust(reviewedUserId, "Received New Review");

    return res.status(201).json({ message: "Review submitted successfully.", review });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "You have already reviewed this user for this interaction.",
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

    const reviews = await Review.find({ reviewed: userId, isDeleted: false })
      .populate("reviewer", "name profileImage studentId")
      .sort({ createdAt: -1 });

    // Compute average rating
    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : null;

    return res.status(200).json({ 
      reviews, 
      avgRating, 
      total: reviews.length,
      trustPtsEarned: reviews.filter(r => r.isVerified).length * 2 // Example metric
    });
  } catch (err) {
    console.error("getReviewsForUser error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// GET /api/reviews/my-given
const getMyGivenReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewer: req.user._id, isDeleted: false })
      .populate("reviewed", "name profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json({ reviews });
  } catch (err) {
    console.error("getMyGivenReviews error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// GET /api/reviews/pending
const getPendingReviews = async (req, res) => {
  try {
<<<<<<< HEAD
    const currentUser = req.user;

    // Find verified L&F matches involving this user's studentId
    const matches = await Match.find({ status: "verified" })
      .populate("lostItemId")
      .populate("foundItemId");

    const involvedMatches = matches.filter((m) => {
      const lostSid = m.lostItemId?.studentId;
      const foundSid = m.foundItemId?.studentId;
      return lostSid === currentUser.studentId || foundSid === currentUser.studentId;
    });

    // Find which matches the user has already reviewed
    const reviewedInteractionIds = new Set(
      (
        await Review.find({
          reviewer: currentUser._id,
          linkedInteractionId: { $in: involvedMatches.map((m) => m._id.toString()) },
          isDeleted: false,
        }).select("linkedInteractionId")
      ).map((r) => r.linkedInteractionId)
    );

    const pending = involvedMatches
      .filter((m) => !reviewedInteractionIds.has(m._id.toString()))
      .map((m) => {
        const isLostParty = m.lostItemId?.studentId === currentUser.studentId;
        const otherItem = isLostParty ? m.foundItemId : m.lostItemId;
        return {
          matchId: m._id,
          interactionType: "lost_found",
          otherPartyStudentId: otherItem?.studentId || null,
          itemName: otherItem?.itemName || otherItem?.title || "Item",
          resolvedAt: m.updatedAt,
        };
      });

    res.status(200).json({ pending });
  } catch (error) {
    console.error("getPendingReviews error:", error);
=======
    // Find verified matches involving this user
    // (This is a simplified lookup for the sake of the dashboard)
    const matches = await Match.find({ status: "verified" })
      .populate("lostItemId foundItemId");
    
    // Filter for matches where the user is one of the parties
    // ... logic would go here to cross-reference existing reviews ...
    
    // For now, return a placeholder or empty list to avoid crashing
    // while we wait for more robust interaction models (Orders/Sales)
    res.status(200).json({ pending: [] });
  } catch (error) {
>>>>>>> develop
    res.status(500).json({ message: "Error fetching pending reviews" });
  }
};

// DELETE /api/reviews/:id
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found." });

    if (review.reviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this review." });
    }

    // 24-hour limit check
    const hoursSinceCreation = (Date.now() - new Date(review.createdAt)) / (1000 * 60 * 60);
    if (hoursSinceCreation > 24) {
      return res.status(403).json({ message: "Reviews cannot be deleted after 24 hours." });
    }

    const reviewedId = review.reviewed;
    review.isDeleted = true;
    await review.save();
    
    // Update trust score after deletion
    await syncUserTrust(reviewedId, "Review Removed/Deleted");

    return res.status(200).json({ message: "Review removed successfully." });
  } catch (err) {
    console.error("deleteReview error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

<<<<<<< HEAD
// GET /api/reviews/received — reviews written ABOUT the logged-in user (protected)
const getMyReceivedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewed: req.user._id, isDeleted: false })
      .populate("reviewer", "name profileImage studentId")
      .sort({ createdAt: -1 });
    return res.status(200).json({ reviews });
  } catch (err) {
    console.error("getMyReceivedReviews error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

=======
>>>>>>> develop
module.exports = { 
  createReview, 
  getReviewsForUser, 
  getMyGivenReviews, 
<<<<<<< HEAD
  getMyReceivedReviews,
=======
>>>>>>> develop
  getPendingReviews,
  deleteReview 
};
