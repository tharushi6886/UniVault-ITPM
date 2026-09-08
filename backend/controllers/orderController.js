const Order = require("../models/Order");
const Item = require("../models/itemModels");
const Message = require("../models/Message");

// CREATE new order
const createOrder = async (req, res) => {
  try {
    const {
      itemId,
      sellerId,
      deliveryMethod,
      building,
      room,
      preferredDate,
      timeWindow,
      totalPrice,
      deliveryFee,
      courierBid,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Receipt image is required" });
    }

    const order = new Order({
      itemId,
      sellerId,
      buyerId: req.user._id,
      deliveryMethod,
      building,
      room,
      preferredDate,
      timeWindow,
      totalPrice: Number(totalPrice),
      deliveryFee: Number(deliveryFee),
      courierBid: Number(courierBid),
      receiptImage: `/uploads/${req.file.filename}`,
    });

    await order.save();

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ message: err.message || "Failed to create order" });
  }
};

// GET seller orders
const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ sellerId: req.user._id })
      .populate("buyerId", "name faculty studentId email profileImage")
      .populate("itemId", "item_name price item_image");

    res.json(orders);
  } catch (err) {
    console.error("Fetch seller orders error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// UPDATE order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const order = await Order.findOne({ _id: id, sellerId: req.user._id });
    if (!order) {
      return res.status(404).json({ message: "Order not found or unauthorized" });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    // If order is completed, mark item as sold
    if (status === "completed") {
      await Item.findByIdAndUpdate(order.itemId, { availability_status: "not_available" });
    }

    // Automated Messaging
    let messageText = null;
    const itemInfo = await Item.findById(order.itemId);
    const itemName = itemInfo ? itemInfo.item_name : "an item";

    if (status === "accepted") {
      messageText = `✅ Your order for "${itemName}" has been accepted!`;
    } else if (status === "rejected") {
      messageText = `❌ Your order for "${itemName}" has been rejected.`;
    } else if (paymentStatus === "verified") {
      messageText = `💳 Your payment for "${itemName}" has been verified!`;
    } else if (status === "completed") {
      messageText = `🏁 Your order for "${itemName}" has been marked as completed.`;
    }

    if (messageText) {
      const newMessage = new Message({
        sender: order.sellerId,
        receiver: order.buyerId,
        text: messageText,
      });
      await newMessage.save();

      const io = req.app.get("io");
      if (io) {
        io.emit("receive_message", newMessage);
      }
    }

    res.json({ message: "Order updated successfully", order });
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ message: "Failed to update order" });
  }
};

module.exports = {
  createOrder,
  getSellerOrders,
  updateOrderStatus,
};
