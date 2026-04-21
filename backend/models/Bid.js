const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema(
  {
    bidder: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bidItem: { type: mongoose.Schema.Types.ObjectId, ref: "BidItem", required: true },
    amount: { type: Number, required: true, min: 1 },
    message: { type: String, trim: true, maxlength: 500, default: "" },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    sellerNote: { type: String, trim: true, maxlength: 300, default: "" },
  },
  { timestamps: true }
);

// One bid per bidder per bid item
bidSchema.index({ bidder: 1, bidItem: 1 }, { unique: true });

module.exports = mongoose.model("Bid", bidSchema);
