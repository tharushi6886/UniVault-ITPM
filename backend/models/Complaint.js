const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    complainant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accused: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["marketplace", "lost_found", "bidding", "general"],
      required: true,
    },
    type: {
      type: String,
      enum: [
        "fraud",
        "fake_listing",
        "harassment",
        "false_report",
        "item_not_delivered",
        "other",
      ],
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    linkedItemId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["open", "under_review", "resolved", "dismissed"],
      default: "open",
    },
    adminNote: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    // The accused user's reply/response to the complaint
    accused_reply: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    repliedAt: {
      type: Date,
      default: null,
    },
    // The complainant's reply to the accused's response
    complainant_reply: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    complainantRepliedAt: {
      type: Date,
      default: null,
    },
    // Full back-and-forth chat thread
    messages: [
      {
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        senderRole: { type: String, enum: ["complainant", "accused"], required: true },
        text: { type: String, trim: true, maxlength: 1000, required: true },
        createdAt: { type: Date, default: Date.now },
        editedAt: { type: Date, default: null },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
