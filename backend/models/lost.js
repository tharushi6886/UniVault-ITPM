const mongoose = require("mongoose");

const LostSchema = new mongoose.Schema({
  name: {
    type:String,
    required:true
  },

  StudentId: {
    type: String,
    required: true
  },

  itemType: {
    type: String,
    required: true,
    enum: ["Lost", "Found"]
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

  location: {
    type: String,
    required: true
  },

  date: {
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

  imageUrl: {
    type: String
  },

  status: {
    type: String,
    default: "Active"
  },



}, { timestamps: true });


module.exports = mongoose.model("Lost", LostSchema);