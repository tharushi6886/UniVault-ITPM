const Item = require("../models/itemModels");
const calculateTrustScore = require("../utils/trustScore");


// GET all items
const getAllItems = async (req,res,next) => {

  let items;

  try{
    items = await Item.find();
  }catch(err){
    console.log(err);
    return res.status(500).json({
      message:"Error fetching items"
    });
  }

  if(!items || items.length === 0){
    return res.status(404).json({
      message:"Items not found"
    });
  }

  return res.status(200).json({ items });
};

// GET my items
const getMyItems = async (req, res, next) => {
  let items;
  try {
    items = await Item.find({ userId: req.user._id });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching user items" });
  }

  if (!items) {
    items = [];
  }

  return res.status(200).json({ items });
};



// ADD new item
const addItems = async (req,res,next)=> {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // 1. Calculate user's trust score to determine limit
    const trustData = await calculateTrustScore(req.user._id);
    if (!trustData) {
      return res.status(500).json({ message: "Error validating user trust" });
    }

    // 2. Count existing items by this user (only active ones)
    const existingCount = await Item.countDocuments({ userId: req.user._id, availability_status: "available" });

    // 3. Enforce limits
    let limit = 0;
    if (trustData.score < 40) limit = 3;
    else if (trustData.score < 80) limit = 10;
    else limit = Infinity;

    if (existingCount >= limit) {
      return res.status(403).json({ 
        message: `Your current Trust Level (${trustData.level}) limits you to ${limit} active items. Please resolve existing items or increase your Trust Score to list more.`,
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
      availability_status,
      approval_status,
      price,
      quantity
    } = req.body;

    let item;

    item = new Item({
      userId: req.user._id,
      item_id,
      item_name,
      description,
      category,
      item_condition,
      brand,
      colour,
      item_type,
      availability_status,
      approval_status,
      price,
      quantity
    });

    await item.save();

    return res.status(201).json({
      message:"Item added successfully",
      item:item
    });

  } catch(err) {
    console.error(err);
    return res.status(500).json({
      message: err.message || "Unable to add item"
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

    // Calculate owner trust data
    const ownerTrust = await calculateTrustScore(item.userId);

    res.status(200).json({
      item,
      ownerTrust: ownerTrust ? {
        score: ownerTrust.score,
        level: ownerTrust.level,
        levelClass: ownerTrust.levelClass
      } : null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching item details" });
  }
};

exports.getAllItems = getAllItems;
exports.addItems = addItems;
exports.getMyItems = getMyItems;
exports.getItemById = getItemById;