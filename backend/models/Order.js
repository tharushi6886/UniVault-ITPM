const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deliveryMethod: {
      type: String,
      enum: ["pickup", "courier"],
      required: true,
    },
    building: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
    preferredDate: {
      type: String,
      required: true,
    },
    timeWindow: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    courierBid: {
      type: Number,
      default: 0,
    },
    receiptImage: {
      type: String, // Store filename/path
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "rejected", "confirmed", "delivered", "cancelled"], // Keep old ones for backward compatibility just in case
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "verified", "paid", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
