const BidItem = require("../models/BidItem");

const createBidItem = async (req, res) => {
  try {
    const { title, description, category, condition, startingPrice, image } = req.body;
    if (!title || !startingPrice) {
      return res.status(400).json({ message: "Title and starting price are required." });
    }
    const bidItem = await BidItem.create({
      seller: req.user._id,
      title, description, category, condition, startingPrice, image,
    });
    return res.status(201).json({ message: "Bid item created.", bidItem });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getMyBidItems = async (req, res) => {
  try {
    const items = await BidItem.find({ seller: req.user._id }).sort({ createdAt: -1 });
    return res.json({ items });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getAllBidItems = async (req, res) => {
  try {
    const items = await BidItem.find({ status: "active" })
      .populate("seller", "name studentId profileImage")
      .sort({ createdAt: -1 });
    return res.json({ items });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateBidItemStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["active", "closed", "sold"].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }
    const item = await BidItem.findOne({ _id: req.params.id, seller: req.user._id });
    if (!item) return res.status(404).json({ message: "Bid item not found." });
    item.status = status;
    await item.save();
    return res.json({ message: "Updated.", item });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteBidItem = async (req, res) => {
  try {
    const item = await BidItem.findOneAndDelete({ _id: req.params.id, seller: req.user._id });
    if (!item) return res.status(404).json({ message: "Bid item not found." });
    return res.json({ message: "Deleted." });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { createBidItem, getMyBidItems, getAllBidItems, updateBidItemStatus, deleteBidItem };
