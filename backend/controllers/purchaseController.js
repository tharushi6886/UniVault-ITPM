const Purchase = require("../models/Purchase");
const Bid = require("../models/Bid");

const createPurchase = async (req, res) => {
  try {
    const { bidId, itemId, amount, address, building, roomNumber, preferredDeliveryDate } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Receipt file is required" });
    }

    const bid = await Bid.findById(bidId);
    if (!bid) return res.status(404).json({ message: "Bid not found" });
    if (bid.status !== "approved") {
      return res.status(400).json({ message: "Bid is not approved" });
    }

    const existing = await Purchase.findOne({ bidId });
    if (existing) {
      return res.status(400).json({ message: "Purchase already submitted for this bid" });
    }

    const purchase = await Purchase.create({
      bidId,
      buyerId: req.user?._id || bid.bidderId,
      itemId,
      amount,
      receiptPath: req.file.filename,
      address,
      building,
      roomNumber,
      preferredDeliveryDate,
    });

    return res.status(201).json({ message: "Purchase submitted successfully", purchase });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to submit purchase" });
  }
};

const getMyPurchases = async (req, res) => {
  try {
    const buyerId = req.user?._id;
    const purchases = await Purchase.find({ buyerId })
      .populate("bidId")
      .populate("itemId", "item_name item_type price");
    return res.status(200).json({ purchases });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching purchases" });
  }
};

const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("buyerId", "name email studentId")
      .populate("itemId", "item_name item_type price")
      .populate("bidId");
    return res.status(200).json({ purchases });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching purchases" });
  }
};

const updatePurchaseStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const purchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!purchase) return res.status(404).json({ message: "Purchase not found" });
    return res.status(200).json({ message: "Status updated", purchase });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error updating purchase status" });
  }
};

module.exports = { createPurchase, getMyPurchases, getAllPurchases, updatePurchaseStatus };
