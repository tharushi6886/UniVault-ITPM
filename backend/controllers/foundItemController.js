const FoundItem = require("../models/FoundItem");
const User = require("../models/User");
const calculateTrustScore = require("../utils/trustScore");

exports.createFoundItem = async (req, res) => {
  try {
    const foundItem = new FoundItem(req.body);
    await foundItem.save();
    res.status(201).json(foundItem);
  } catch (err) {
    res.status(500).json({ message: "Error creating found item", error: err.message });
  }
};

exports.getMyFoundItems = async (req, res) => {
  try {
    const items = await FoundItem.find({ studentId: req.user.studentId }).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user found items", error: err.message });
  }
};

exports.getAllFoundItems = async (req, res) => {
  try {
    const items = await FoundItem.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching found items", error: err.message });
  }
};

exports.updateFoundItem = async (req, res) => {
  try {
    const updated = await FoundItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating found item", error: err.message });
  }
};

exports.deleteFoundItem = async (req, res) => {
  try {
    await FoundItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Found item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting found item", error: err.message });
  }
};

exports.getFoundItemById = async (req, res) => {
  try {
    const item = await FoundItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Found item not found" });
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
    res.status(500).json({ message: "Error fetching found item details", error: err.message });
  }
};
