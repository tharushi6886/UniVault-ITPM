const User = require("../models/User");
const Item = require("../models/itemModels");
const LostItem = require("../models/LostItem");
const FoundItem = require("../models/FoundItem");
const Review = require("../models/Review");
const Order = require("../models/Order");

const getActivityLog = async (req, res) => {
  try {
    // Fetch recent items from different collections to simulate activity
    const users = await User.find().sort({ createdAt: -1 }).limit(5);
    const items = await Item.find().sort({ createdAt: -1 }).limit(5);
    const lostItems = await LostItem.find().sort({ createdAt: -1 }).limit(5);
    const foundItems = await FoundItem.find().sort({ createdAt: -1 }).limit(5);
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(5);

    let activities = [];

    users.forEach(user => {
      activities.push({
        type: 'user',
        description: `New user registration via Student ID ${user.studentId}`,
        username: user.name,
        timestamp: user.createdAt,
        color: 'green'
      });
    });

    items.forEach(item => {
      activities.push({
        type: 'market',
        description: `Posted a new marketplace listing: ${item.item_name}`,
        username: 'A user', // we don't have user object populated easily without populate
        timestamp: item.createdAt,
        color: 'blue'
      });
    });

    lostItems.forEach(item => {
      activities.push({
        type: 'lost',
        description: `Reported a lost item: ${item.itemName}`,
        username: 'A student',
        timestamp: item.createdAt,
        color: 'amber'
      });
    });
    
    foundItems.forEach(item => {
      activities.push({
        type: 'found',
        description: `Reported a found item: ${item.itemName}`,
        username: 'A student',
        timestamp: item.createdAt,
        color: 'teal'
      });
    });

    reviews.forEach(review => {
      activities.push({
        type: 'review',
        description: `Left a review for a transaction`,
        username: 'A user',
        timestamp: review.createdAt,
        color: 'purple'
      });
    });

    // Sort all by timestamp descending and take top 10
    activities.sort((a, b) => b.timestamp - a.timestamp);
    const latestActivities = activities.slice(0, 10);

    res.json(latestActivities);
  } catch (error) {
    console.error("Activity log error:", error);
    res.status(500).json({ message: "Failed to fetch activity log" });
  }
};

const getUsersForExport = async (req, res) => {
  try {
    const { role, status, dateRange } = req.query;
    let query = {};

    // Filter by Role
    if (role && role !== "all") {
      query.role = role;
    }

    // Filter by Status
    if (status && status !== "all") {
      query.status = status;
    }

    // Filter by Date Range
    if (dateRange === "this_month") {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      query.createdAt = { $gte: startOfMonth };
    }

    const users = await User.find(query)
      .select("name email studentId role status trustScore createdAt")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error("Export users error:", error);
    res.status(500).json({ message: "Failed to fetch users for export" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("buyerId", "name email studentId")
      .populate("sellerId", "name email studentId")
      .populate("itemId", "item_name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Admin fetch orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Admin delete order error:", error);
    res.status(500).json({ message: "Failed to delete order" });
  }
};

const deleteMarketplaceItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Admin delete item error:", error);
    res.status(500).json({ message: "Failed to delete item" });
  }
};

module.exports = { 
  getActivityLog, 
  getUsersForExport, 
  getAllOrders, 
  deleteOrder, 
  deleteMarketplaceItem 
};
