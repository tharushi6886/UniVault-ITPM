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
  },
  { timestamps: true }
);

// Prevent duplicate: same reviewer cannot review same user for same interaction type twice
reviewSchema.index({ reviewer: 1, reviewed: 1, interactionType: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
