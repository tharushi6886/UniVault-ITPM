const FoundItem = require("../models/FoundItem");

exports.createFoundItem = async (req, res) => {
  try {
    const foundItem = new FoundItem(req.body);
    await foundItem.save();
    res.status(201).json(foundItem);
  } catch (err) {
    res.status(500).json({ message: "Error creating found item", error: err.message });
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
