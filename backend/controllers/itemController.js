const Item = require("../models/itemModels");


// GET all items
const getAllItems = async (req, res, next) => {

  let items;

  try {
    items = await Item.find();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Error fetching items"
    });
  }

  if (!items || items.length === 0) {
    return res.status(404).json({
      message: "Items not found"
    });
  }

  return res.status(200).json({ items });
};



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

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Unable to add item"
    });
  }

  return res.status(201).json({
    message: "Item added successfully",
    item: item
  });

};


exports.getAllItems = getAllItems;
exports.addItems = addItems;
// exports are defined above