const mongoose = require("mongoose");

const LostItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  studentId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  brand: { type: String },
  color: { type: String },
  contactNumber: { type: String, required: true },
  whatsappLink: { type: String },
  imageUrl: { type: String },
  status: { type: String, default: "active", enum: ["active", "resolved"] }
}, { timestamps: true });

module.exports = mongoose.model("LostItem", LostItemSchema);
