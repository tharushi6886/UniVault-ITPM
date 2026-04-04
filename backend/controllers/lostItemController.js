const LostItem = require("../models/LostItem");

exports.createLostItem = async (req, res) => {
  try {
    const lostItem = new LostItem(req.body);
    await lostItem.save();
    res.status(201).json(lostItem);
  } catch (err) {
    res.status(500).json({ message: "Error creating lost item", error: err.message });
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
