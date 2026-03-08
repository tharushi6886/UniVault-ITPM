const mongoose = require("mongoose");

const LostSchema = new mongoose.Schema({

  studentID: {
    type: String,
    required: true
  },

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  locationLost: {
    type: String,
    required: true
  },

  dateLost: {
    type: Date,
    required: true
  },

  contactNumber: {
    type: String,
    required: true
  },

  whatsappLink: {
    type: String,
    required: true
  },

  status: {
    type: String,
    default: "Active"
  },

  expiryDate: {
    type: Date
  }

}, { timestamps: true });

module.exports = mongoose.model("Lost", LostSchema);