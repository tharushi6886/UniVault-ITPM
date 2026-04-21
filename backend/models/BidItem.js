const mongoose = require("mongoose");

const bidItemSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 1000, default: "" },
    category: { type: String, trim: true, default: "Other" },
    condition: { type: String, enum: ["new", "used", "damaged"], default: "used" },
    startingPrice: { type: Number, required: true, min: 1 },
    image: { type: String, default: "" },
    status: { type: String, enum: ["active", "closed", "sold"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BidItem", bidItemSchema);
