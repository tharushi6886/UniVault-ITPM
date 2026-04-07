const Item = require("../models/itemModels");
const calculateTrustScore = require("../utils/trustScore");

// GET all items
const getAllItems = async (req, res, next) => {
  try {
    const items = await Item.find();

    if (!items || items.length === 0) {
      return res.status(404).json({ message: "Items not found" });
    }

    return res.status(200).json({ items });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching items" });
  try {
    items = await Item.find();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Error fetching items"
    });
  }
};

// GET my items
const getMyItems = async (req, res, next) => {
  try {
    const items = await Item.find({ userId: req.user._id });
    return res.status(200).json({ items: items || [] });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching user items" });
  if (!items || items.length === 0) {
    return res.status(404).json({
      message: "Items not found"
    });
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
// ADD new item
const addItems = async (req, res, next) => {
  console.log("Start");

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

  // prefer authenticated user id (req.user) but fall back to body.userId if provided
  const userIdToSave = (req.user && req.user._id) || req.body.userId || undefined;

  let item;

  try {

    const resolvedType = item_type || listing_type || 'sell';

    item = new Item({
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

    const item = new Item({
      userId: req.user._id,
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
      // normalize to stored field
      item_type: resolvedType,
      // also keep original listing_type if provided
      listing_type: listing_type || undefined,
      item_image: item_image || undefined,
      userId: userIdToSave,
      payment_details: payment_details || undefined,
      availability_status,
      approval_status,
      price,
      quantity
    });

    await item.save();

    return res.status(201).json({
      message: "Item added successfully",
      item: item
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err.message || "Unable to add item"
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Unable to add item"
    });
  }
};

// GET single item with owner trust
const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const ownerTrust = await calculateTrustScore(item.userId);

    return res.status(200).json({
      item,
      ownerTrust: ownerTrust
        ? {
            score: ownerTrust.score,
            level: ownerTrust.level,
            levelClass: ownerTrust.levelClass
          }
        : null
    });
  return res.status(201).json({
    message: "Item added successfully",
    item: item
  });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching item details" });
  }
};

exports.getAllItems = getAllItems;
exports.getMyItems = getMyItems;
exports.addItems = addItems;
exports.getItemById = getItemById;
exports.addItems = addItems;
// exports are defined above
