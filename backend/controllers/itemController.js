const Item = require("../models/itemModels");


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



// ADD new item
const addItems = async (req,res,next)=> {

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

  try{

    item = new Item({
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

  }catch(err){
    console.log(err);
    return res.status(500).json({
      message:"Unable to add item"
    });
  }

  return res.status(201).json({
    message:"Item added successfully",
    item:item
  });

};


exports.getAllItems = getAllItems;
exports.addItems = addItems;