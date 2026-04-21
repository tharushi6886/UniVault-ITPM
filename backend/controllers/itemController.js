const Item = require("../models/itemModels");
const calculateTrustScore = require("../utils/trustScore");
const syncUserTrust = require("../utils/reputationSync");

// GET all items
const getAllItems = async (req, res, next) => {
  try {
    const items = await Item.find();

    if (!items || items.length === 0) {
      return res.status(404).json({ message: "Items not found" });
    }

    return res.status(200).json({ items });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching items" });
  }
};

// GET my items
const getMyItems = async (req, res, next) => {
  try {
    const items = await Item.find({ userId: req.user._id });
    return res.status(200).json({ items: items || [] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching user items" });
  }
};

// ADD new item
const addItems = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // 🔥 TRUST CHECK
    const trustData = await calculateTrustScore(req.user._id);
    if (!trustData) {
      return res.status(500).json({ message: "Error validating user trust" });
    }

    const existingCount = await Item.countDocuments({
      userId: req.user._id,
      availability_status: "available"
    });

    let limit = 0;
    if (trustData.score < 40) limit = 3;
    else if (trustData.score < 80) limit = 10;
    else limit = Infinity;

    if (existingCount >= limit) {
      return res.status(403).json({
        message: `Your Trust Level (${trustData.level}) allows only ${limit} active items`,
        currentTrust: trustData.score,
        limit
      });
    }

    const {
      item_id,
      item_name,
      description,
      category,
      item_condition,
      brand,
      colour,
      item_type,
      listing_type,
      item_image,
      payment_details,
      availability_status,
      approval_status,
      price,
      quantity
    } = req.body;

    const resolvedType = item_type || listing_type || "sell";
    const userIdToSave = req.user._id || req.body.userId;

    const item = new Item({
      userId: userIdToSave,
      item_id,
      item_name,
      description,
      category,
      item_condition,
      brand,
      colour,
      item_type: resolvedType,
      listing_type: listing_type || undefined,
      item_image: item_image || undefined,
      payment_details: payment_details || undefined,
      availability_status: availability_status || "available",
      approval_status: approval_status || "pending",
      price,
      quantity
    });

    await item.save();

    // Recalculate and persist trust score for the user
    await syncUserTrust(userIdToSave);

    return res.status(201).json({
      message: "Item added successfully",
      item: item
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err.message || "Unable to add item"
    });
  }
};

// GET single item with owner trust
const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate("userId", "name profileImage");

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const ownerTrust = await calculateTrustScore(item.userId?._id || item.userId);

    return res.status(200).json({
      item,
      ownerTrust: ownerTrust
        ? {
            score: ownerTrust.totalScore,
            level: ownerTrust.status,
            levelClass: ownerTrust.totalScore >= 80 ? 'high' : ownerTrust.totalScore >= 50 ? 'medium' : 'low',
            avgRating: ownerTrust.stats.avgRating,
            reviewCount: ownerTrust.stats.reviewCount
          }
        : null
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching item details" });
  }
};

const updateItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // Sync trust score (could be a status change or deletion proxy)
    await syncUserTrust(item.userId);

    res.status(200).json({ item: updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating item" });
  }
};

exports.getAllItems = getAllItems;
exports.getMyItems = getMyItems;
exports.addItems = addItems;
exports.getItemById = getItemById;
exports.updateItem = updateItem;