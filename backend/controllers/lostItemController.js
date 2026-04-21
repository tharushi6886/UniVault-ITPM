const LostItem = require("../models/LostItem");
const User = require("../models/User");
const calculateTrustScore = require("../utils/trustScore");
const syncUserTrust = require("../utils/reputationSync");

exports.createLostItem = async (req, res) => {
  try {
    const lostItem = new LostItem(req.body);
    await lostItem.save();

    // Trigger real-time sync for the item owner
    const user = await User.findOne({ studentId: lostItem.studentId });
    if (user) await syncUserTrust(user._id, "Reported Lost Item");

    res.status(201).json(lostItem);
  } catch (err) {
    res.status(500).json({ message: "Error creating lost item", error: err.message });
  }
};

exports.getMyLostItems = async (req, res) => {
  try {
    const items = await LostItem.find({ studentId: req.user.studentId }).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user lost items", error: err.message });
  }
};

exports.getAllLostItems = async (req, res) => {
  try {
    const items = await LostItem.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching lost items", error: err.message });
  }
};

exports.updateLostItem = async (req, res) => {
  try {
    const updated = await LostItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // Sync trust if status or ownership could have changed
    const user = await User.findOne({ studentId: updated.studentId });
    if (user) await syncUserTrust(user._id, `Updated Lost Item: ${updated.status}`);

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating lost item", error: err.message });
  }
};

exports.deleteLostItem = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id);
    if (item) {
      const user = await User.findOne({ studentId: item.studentId });
      await LostItem.findByIdAndDelete(req.params.id);
      if (user) await syncUserTrust(user._id);
    }
    res.status(200).json({ message: "Lost item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting lost item", error: err.message });
  }
};

exports.getLostItemById = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Lost item not found" });
    }

    // Lookup owner by studentId
    const owner = await User.findOne({ studentId: item.studentId });
    let ownerTrust = null;
    if (owner) {
      ownerTrust = await calculateTrustScore(owner._id);
    }

    res.status(200).json({
      item,
      ownerTrust: ownerTrust ? {
        score: ownerTrust.score,
        level: ownerTrust.level,
        levelClass: ownerTrust.levelClass
      } : null,
      ownerId: owner ? owner._id : null
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching lost item details", error: err.message });
  }
};

const sendEmail = require("../utils/sendEmail");

exports.notifyUser = async (req, res) => {
  try {
    const { message } = req.body;
    const item = await LostItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const user = await User.findOne({ studentId: item.studentId });

    let recipientEmail = user ? user.email : `${item.studentId.toLowerCase()}@my.sliit.lk`;

    if (!recipientEmail) {
      return res.status(404).json({ message: "Student email could not be determined" });
    }

    const subject = `UniVault: Update regarding your lost item "${item.title}"`;
    const emailBody = `
Dear ${user ? user.name : "Student"},

This is an automated notification from the UniVault Admin Team regarding the item you reported as lost: "${item.title}".

Admin Message:
"${message || "Our team is actively assisting in the recovery of this item. Please check your dashboard for further updates."}"

If you have already recovered this item, please mark it as FOUND on your dashboard to help us maintain accurate records.

Best regards,
UniVault Admin Team
    `;

    await sendEmail(recipientEmail, subject, emailBody);

    res.status(200).json({ message: `Notification sent successfully to ${recipientEmail}` });
  } catch (err) {
    console.error("Notification Error:", err);
    res.status(500).json({ message: "Failed to send email notification", error: err.message });
  }
};

