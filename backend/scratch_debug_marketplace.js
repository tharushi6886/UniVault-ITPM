const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Item = require('./models/itemModels');
const Order = require('./models/Order');

async function debug() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const items = await Item.find();
    console.log(`Total Items: ${items.length}`);
    items.slice(0, 3).forEach(i => console.log(`- Item: ${i.item_name}, ID: ${i._id}`));

    const orders = await Order.find();
    console.log(`Total Orders: ${orders.length}`);
    orders.slice(0, 3).forEach(o => console.log(`- Order ID: ${o._id}, Status: ${o.status}`));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

debug();
