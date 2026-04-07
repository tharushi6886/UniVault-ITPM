const LostItem = require("../models/LostItem");
const User = require("../models/User");
const calculateTrustScore = require("../utils/trustScore");

exports.createLostItem = async (req, res) => {
  try {
    const lostItem = new LostItem(req.body);
    await lostItem.save();
    res.status(201).json(lostItem);
  } catch (err) {
    res.status(500).json({ message: "Error creating lost item", error: err.message });
  }
};

exports.getMyLostItems = async (req, res) => {
  try {
    const items = await LostItem.find({ studentId: req.user.studentId }).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user lost items", error: err.message });
  }
};

exports.getAllLostItems = async (req, res) => {
  try {
    const items = await LostItem.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching lost items", error: err.message });
  }
};

exports.updateLostItem = async (req, res) => {
  try {
    const updated = await LostItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating lost item", error: err.message });
  }
};

exports.deleteLostItem = async (req, res) => {
  try {
    await LostItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Lost item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting lost item", error: err.message });
  }
};

exports.getLostItemById = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Lost item not found" });
    }

    // Lookup owner by studentId
    const owner = await User.findOne({ studentId: item.studentId });
    let ownerTrust = null;
    if (owner) {
      ownerTrust = await calculateTrustScore(owner._id);
    }

    res.status(200).json({
      item,
      ownerTrust: ownerTrust ? {
        score: ownerTrust.score,
        level: ownerTrust.level,
        levelClass: ownerTrust.levelClass
      } : null
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching lost item details", error: err.message });
  }
};
