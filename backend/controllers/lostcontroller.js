const Lost = require("../models/lost");

// CREATE
exports.createLost = async (req, res) => {
  try {
    const lost = new Lost(req.body);
    await lost.save();
    res.status(201).json(lost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ALL
exports.getAllLost = async (req, res) => {
  try {
    const lostItems = await Lost.find();
    res.json(lostItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ONE
exports.getLostById = async (req, res) => {
  try {
    const lost = await Lost.findById(req.params.id);
    res.json(lost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
exports.updateLost = async (req, res) => {
  try {
    const lost = await Lost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(lost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
exports.deleteLost = async (req, res) => {
  try {
    await Lost.findByIdAndDelete(req.params.id);
    res.json({ message: "Lost item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
