const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    interactionType: {
      type: String,
      enum: ["marketplace", "lost_found", "bidding", "general"],
      required: true,
    },
    category: {
      type: String,
      enum: ["marketplace", "lost_found", "general"],
      default: "general",
    },
    linkedInteractionId: {
      type: String, // ID of Item or Match record
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    reply: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    repliedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Prevent duplicate: same reviewer cannot review same user for same interaction twice
// 1. One review per specific interaction (Marketplace Item / L&F Match)
reviewSchema.index(
  { reviewer: 1, reviewed: 1, linkedInteractionId: 1 }, 
  { unique: true, partialFilterExpression: { linkedInteractionId: { $type: "string" } } }
);

// 2. One general review per person (if no interaction ID provided)
reviewSchema.index(
  { reviewer: 1, reviewed: 1, interactionType: 1 }, 
  { unique: true, partialFilterExpression: { linkedInteractionId: null } }
);

module.exports = mongoose.model("Review", reviewSchema);
