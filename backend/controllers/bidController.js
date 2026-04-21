const Bid = require("../models/Bid");
const BidItem = require("../models/BidItem");

// POST /api/bids
const placeBid = async (req, res) => {
  try {
    const { bidItemId, amount, message } = req.body;

    if (!bidItemId || !amount) {
      return res.status(400).json({ message: "Bid item and amount are required." });
    }

    const bidItem = await BidItem.findById(bidItemId);
    if (!bidItem) return res.status(404).json({ message: "Bid item not found." });

    if (bidItem.seller?.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot bid on your own item." });
    }

    if (bidItem.status !== "active") {
      return res.status(400).json({ message: "This item is no longer open for bidding." });
    }

    const bid = await Bid.create({
      bidder: req.user._id,
      bidItem: bidItemId,
      amount,
      message: message?.trim() || "",
    });

    await bid.populate("bidder", "name studentId profileImage");
    await bid.populate("bidItem", "title startingPrice image");

    return res.status(201).json({ message: "Bid placed successfully.", bid });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "You have already placed a bid on this item." });
    }
    console.error("placeBid error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// GET /api/bids/my — bids placed by current user
const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ bidder: req.user._id })
      .populate({
        path: "bidItem",
        select: "title startingPrice image status seller",
        populate: { path: "seller", select: "_id name studentId" },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({ bids });
  } catch (err) {
    console.error("getMyBids error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// GET /api/bids/received — bids on current user's bid items (seller view)
const getReceivedBids = async (req, res) => {
  try {
    const myItems = await BidItem.find({ seller: req.user._id }).select("_id");
    const itemIds = myItems.map((i) => i._id);

    const bids = await Bid.find({ bidItem: { $in: itemIds } })
      .populate("bidder", "name studentId profileImage trustScore")
      .populate("bidItem", "title startingPrice image")
      .sort({ createdAt: -1 });

    return res.status(200).json({ bids });
  } catch (err) {
    console.error("getReceivedBids error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// GET /api/bids/item/:bidItemId — all bids on a specific bid item (owner or admin)
const getBidsForItem = async (req, res) => {
  try {
    const bidItem = await BidItem.findById(req.params.bidItemId);
    if (!bidItem) return res.status(404).json({ message: "Bid item not found." });

    if (bidItem.seller?.toString() !== req.user._id.toString() && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Not authorized." });
    }

    const bids = await Bid.find({ bidItem: req.params.bidItemId })
      .populate("bidder", "name studentId profileImage trustScore")
      .sort({ amount: -1 });

    return res.status(200).json({ bids });
  } catch (err) {
    console.error("getBidsForItem error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// PATCH /api/bids/:id/status — accept or reject (bid item owner only)
const updateBidStatus = async (req, res) => {
  try {
    const { status, sellerNote } = req.body;
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be accepted or rejected." });
    }

    const bid = await Bid.findById(req.params.id).populate("bidItem");
    if (!bid) return res.status(404).json({ message: "Bid not found." });

    if (bid.bidItem.seller?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the item owner can accept or reject bids." });
    }

    bid.status = status;
    if (sellerNote !== undefined) bid.sellerNote = sellerNote.trim();
    await bid.save();

    // When a bid is accepted, mark the BidItem as "sold"
    // so it no longer appears in Browse Items (which only shows "active" items)
    if (status === "accepted") {
      await BidItem.findByIdAndUpdate(bid.bidItem._id, { status: "sold" });
    }

    await bid.populate("bidder", "name studentId profileImage");

    return res.status(200).json({ message: `Bid ${status}.`, bid });
  } catch (err) {
    console.error("updateBidStatus error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// GET /api/bids/admin/all — Admin only
const getAllBidsAdmin = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status && status !== "all" ? { status } : {};

    const bids = await Bid.find(query)
      .populate("bidder", "name studentId")
      .populate("bidItem", "title startingPrice")
      .sort({ createdAt: -1 })
      .limit(100);

    return res.status(200).json({ bids });
  } catch (err) {
    console.error("getAllBidsAdmin error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = { placeBid, getMyBids, getReceivedBids, getBidsForItem, updateBidStatus, getAllBidsAdmin };
