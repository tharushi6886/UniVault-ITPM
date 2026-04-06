const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({

  item_id: {
    type: String,
    required: true
  },

  item_name: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  category: {
    type: String
  },

  item_condition: {
    type: String,
    enum: ["new", "used", "damaged"]
  },

  brand: {
    type: String
  },

  colour: {
    type: String
  },

  // legacy/internal field used previously
  item_type: {
    type: String,
    enum: ["sell", "lost", "found"]
  },

  // user-facing name for listing type (matches frontend's "listing_type")
  listing_type: {
    type: String,
    enum: ["sell", "lost", "found"]
  },

  // store small/medium base64 or URL to uploaded image
  item_image: {
    type: String
  },



  payment_details: {
    bank_name: { type: String },
    branch: { type: String },
    account_name: { type: String },
    account_number: { type: String }
  },

  availability_status: {
    type: String,
    enum: ["available", "not_available"],
    default: "available"
  },

  approval_status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  price: {
    type: Number
  },

  quantity: {
    type: Number
  },
    // associate item with a user (optional)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

}, { timestamps: true });

module.exports = mongoose.model("Item", itemSchema);