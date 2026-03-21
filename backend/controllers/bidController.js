const Bid = require("../models/Bid");

const createBid = async (req, res) => {
  const { itemId, bidAmount, bidderNote, fullName, email, phoneNumber } = req.body;

  try {
    const bid = new Bid({
      itemId,
      bidderId: req.user._id,
      bidAmount,
      bidderNote,
      fullName,
      email,
      phoneNumber,
    });
    await bid.save();
    return res.status(201).json({ message: "Bid placed successfully", bid });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to place bid" });
  }
};

const getBids = async (req, res) => {
  try {
    const bids = await Bid.find()
      .populate("itemId", "item_name item_type price")
      .populate("bidderId", "name email studentId");
    return res.status(200).json({ bids });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching bids" });
  }
};

const getBidById = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id)
      .populate("itemId", "item_name item_type price")
      .populate("bidderId", "name email studentId");
    if (!bid) return res.status(404).json({ message: "Bid not found" });
    return res.status(200).json({ bid });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching bid" });
  }
};

const updateBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);
    if (!bid) return res.status(404).json({ message: "Bid not found" });

    if (bid.bidderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this bid" });
    }

    const { bidAmount, bidderNote, fullName, email, phoneNumber } = req.body;
    if (bidAmount !== undefined) bid.bidAmount = bidAmount;
    if (bidderNote !== undefined) bid.bidderNote = bidderNote;
    if (fullName !== undefined) bid.fullName = fullName;
    if (email !== undefined) bid.email = email;
    if (phoneNumber !== undefined) bid.phoneNumber = phoneNumber;

    await bid.save();
    return res.status(200).json({ message: "Bid updated successfully", bid });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error updating bid" });
  }
};

const deleteBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);
    if (!bid) return res.status(404).json({ message: "Bid not found" });

    const isOwner = bid.bidderId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "Admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this bid" });
    }

    await bid.deleteOne();
    return res.status(200).json({ message: "Bid deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error deleting bid" });
  }
};

const approveBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);
    if (!bid) return res.status(404).json({ message: "Bid not found" });

    bid.status = "approved";
    await bid.save();
    return res.status(200).json({ message: "Bid approved", bid });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error approving bid" });
  }
};

const rejectBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);
    if (!bid) return res.status(404).json({ message: "Bid not found" });

    bid.status = "rejected";
    await bid.save();
    return res.status(200).json({ message: "Bid rejected", bid });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error rejecting bid" });
  }
};

const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ bidderId: req.user._id }).populate(
      "itemId",
      "item_name item_type price category"
    );
    return res.status(200).json({ bids });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching your bids" });
  }
};

module.exports = {
  createBid,
  getBids,
  getBidById,
  updateBid,
  deleteBid,
  approveBid,
  rejectBid,
  getMyBids,
};
