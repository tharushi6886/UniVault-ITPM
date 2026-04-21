const Order = require("../models/Order");

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

exports.createOrder = createOrder;
