const FoundItem = require("../models/FoundItem");
const User = require("../models/User");
const calculateTrustScore = require("../utils/trustScore");
const syncUserTrust = require("../utils/reputationSync");

exports.createFoundItem = async (req, res) => {
  try {
    const foundItem = new FoundItem(req.body);
    await foundItem.save();

    // Trigger real-time sync for the item owner
    const user = await User.findOne({ studentId: foundItem.studentId });
    if (user) await syncUserTrust(user._id);

    res.status(201).json(foundItem);
  } catch (err) {
    res.status(500).json({ message: "Error creating found item", error: err.message });
  }
};

exports.getMyFoundItems = async (req, res) => {
  try {
    const items = await FoundItem.find({ studentId: req.user.studentId }).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user found items", error: err.message });
  }
};

exports.getAllFoundItems = async (req, res) => {
  try {
    const items = await FoundItem.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching found items", error: err.message });
  }
};

exports.updateFoundItem = async (req, res) => {
  try {
    const updated = await FoundItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // Sync trust if status or ownership could have changed
    const user = await User.findOne({ studentId: updated.studentId });
    if (user) await syncUserTrust(user._id);

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating found item", error: err.message });
  }
};

exports.deleteFoundItem = async (req, res) => {
  try {
    const item = await FoundItem.findById(req.params.id);
    if (item) {
      const user = await User.findOne({ studentId: item.studentId });
      await FoundItem.findByIdAndDelete(req.params.id);
      if (user) await syncUserTrust(user._id);
    }
    res.status(200).json({ message: "Found item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting found item", error: err.message });
  }
};

exports.getFoundItemById = async (req, res) => {
  try {
    const item = await FoundItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Found item not found" });
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
    res.status(500).json({ message: "Error fetching found item details", error: err.message });
  }
};

const sendEmail = require("../utils/sendEmail");

exports.notifyUser = async (req, res) => {
  try {
    const { message } = req.body;
    const item = await FoundItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const user = await User.findOne({ studentId: item.studentId });

    let recipientEmail = user ? user.email : `${item.studentId.toLowerCase()}@my.sliit.lk`;

    if (!recipientEmail) {
      return res.status(404).json({ message: "Student email could not be determined" });
    }

    const subject = `UniVault: Update regarding your found item "${item.title}"`;
    const emailBody = `
Dear ${user.name},

This is an automated notification from the UniVault Admin Team regarding the item you reported as found: "${item.title}".

Admin Message:
"${message || "Our team is checking your found item report. Please check your dashboard for further updates."}"

If you have already returned this item to its rightful owner, please mark it as RESOLVED on your dashboard to help us maintain accurate records.

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

