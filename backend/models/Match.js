const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
  lostItemId: { type: mongoose.Schema.Types.ObjectId, ref: "LostItem", required: true },
  foundItemId: { type: mongoose.Schema.Types.ObjectId, ref: "FoundItem", required: true },
  score: { type: Number, required: true },
  reasons: [{ type: String }],
  status: { type: String, default: "suggested", enum: ["suggested", "verified", "rejected"] }
}, { timestamps: true });

module.exports = mongoose.model("Match", MatchSchema);
