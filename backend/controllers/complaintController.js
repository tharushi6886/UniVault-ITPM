const Complaint = require("../models/Complaint");
const User = require("../models/User");

// POST /api/complaints
const submitComplaint = async (req, res) => {
  try {
    const complainant = req.user._id;
    const { accusedUserId, category, type, subject, description, linkedItemId } = req.body;

    if (complainant.toString() === accusedUserId) {
      return res.status(400).json({ message: "You cannot file a complaint against yourself." });
    }

    const accused = await User.findById(accusedUserId);
    if (!accused) {
      return res.status(404).json({ message: "Reported user not found." });
    }

    const complaint = await Complaint.create({
      complainant,
      accused: accusedUserId,
      category,
      type,
      subject: subject.trim(),
      description: description.trim(),
      linkedItemId: linkedItemId || null,
    });

    await complaint.populate("complainant", "name studentId");
    await complaint.populate("accused", "name studentId");

    return res.status(201).json({ message: "Complaint submitted successfully.", complaint });
  } catch (err) {
    console.error("submitComplaint error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// GET /api/complaints/my
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ complainant: req.user._id })
      .populate("accused", "name studentId profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json({ complaints });
  } catch (err) {
    console.error("getMyComplaints error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// GET /api/complaints/:id
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("complainant", "name studentId profileImage")
      .populate("accused", "name studentId profileImage")
      .populate("resolvedBy", "name");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found." });
    }

    const isOwner = complaint.complainant._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "Admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized." });
    }

    return res.status(200).json({ complaint });
  } catch (err) {
    console.error("getComplaintById error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// GET /api/complaints/against-me — complaints filed AGAINST the current user
const getComplaintsAgainstMe = async (req, res) => {
  try {
    const complaints = await Complaint.find({ accused: req.user._id })
      .populate("complainant", "name studentId profileImage")
      .sort({ createdAt: -1 });
    return res.status(200).json({ complaints });
  } catch (err) {
    console.error("getComplaintsAgainstMe error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// GET /api/complaints/admin/all  (Admin only)
const getAllComplaints = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status && status !== "all") query.status = status;
    if (category && category !== "all") query.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Complaint.countDocuments(query);
    const complaints = await Complaint.find(query)
      .populate("complainant", "name studentId profileImage")
      .populate("accused", "name studentId profileImage")
      .populate("resolvedBy", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return res.status(200).json({ complaints, total, page: parseInt(page) });
  } catch (err) {
    console.error("getAllComplaints error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// PATCH /api/complaints/admin/:id/status  (Admin only)
const updateComplaintStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const validStatuses = ["open", "under_review", "resolved", "dismissed"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found." });
    }

    complaint.status = status;
    if (adminNote !== undefined) complaint.adminNote = adminNote.trim();
    if (status === "resolved" || status === "dismissed") {
      complaint.resolvedBy = req.user._id;
      complaint.resolvedAt = new Date();
    }
    await complaint.save();

    await complaint.populate("complainant", "name studentId");
    await complaint.populate("accused", "name studentId");
    await complaint.populate("resolvedBy", "name");

    return res.status(200).json({ message: "Complaint updated.", complaint });
  } catch (err) {
    console.error("updateComplaintStatus error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// POST /api/complaints/:id/reply — accused user submits a reply
const replyToComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found." });

    // Only the accused user may reply
    if (complaint.accused.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to reply to this complaint." });
    }

    const { reply } = req.body;
    if (!reply || !reply.trim()) return res.status(400).json({ message: "Reply cannot be empty." });

    complaint.accused_reply = reply.trim();
    complaint.repliedAt = new Date();
    await complaint.save();

    return res.status(200).json({ message: "Reply submitted.", complaint });
  } catch (err) {
    console.error("replyToComplaint error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// POST /api/complaints/:id/buyer-reply — complainant replies to the accused's response
const buyerReplyToComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found." });

    // Only the original complainant may use this
    if (complaint.complainant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized." });
    }

    if (!complaint.accused_reply) {
      return res.status(400).json({ message: "Cannot reply before the accused has responded." });
    }

    const { reply } = req.body;
    if (!reply || !reply.trim()) return res.status(400).json({ message: "Reply cannot be empty." });

    complaint.complainant_reply = reply.trim();
    complaint.complainantRepliedAt = new Date();
    await complaint.save();

    return res.status(200).json({ message: "Reply submitted.", complaint });
  } catch (err) {
    console.error("buyerReplyToComplaint error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// POST /api/complaints/:id/message — either party sends a chat message
const sendComplaintMessage = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found." });

    const userId = req.user._id.toString();
    const isComplainant = complaint.complainant.toString() === userId;
    const isAccused     = complaint.accused.toString()     === userId;

    if (!isComplainant && !isAccused) {
      return res.status(403).json({ message: "Not authorized to participate in this complaint." });
    }

    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ message: "Message cannot be empty." });

    const senderRole = isComplainant ? "complainant" : "accused";
    complaint.messages.push({ senderId: req.user._id, senderRole, text: text.trim() });
    await complaint.save();

    const updated = await Complaint.findById(complaint._id)
      .populate("messages.senderId", "name profileImage studentId");
    return res.status(200).json({ message: "Message sent.", messages: updated.messages });
  } catch (err) {
    console.error("sendComplaintMessage error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// PATCH /api/complaints/:id/message/:msgId — edit own message
const editComplaintMessage = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found." });

    const msg = complaint.messages.id(req.params.msgId);
    if (!msg) return res.status(404).json({ message: "Message not found." });

    if (msg.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only edit your own messages." });
    }

    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ message: "Message cannot be empty." });

    msg.text     = text.trim();
    msg.editedAt = new Date();
    await complaint.save();

    const updated = await Complaint.findById(complaint._id)
      .populate("messages.senderId", "name profileImage studentId");
    return res.status(200).json({ message: "Message updated.", messages: updated.messages });
  } catch (err) {
    console.error("editComplaintMessage error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// DELETE /api/complaints/:id/message/:msgId — delete own message
const deleteComplaintMessage = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found." });

    const msg = complaint.messages.id(req.params.msgId);
    if (!msg) return res.status(404).json({ message: "Message not found." });

    if (msg.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own messages." });
    }

    complaint.messages.pull({ _id: req.params.msgId });
    await complaint.save();

    return res.status(200).json({ message: "Message deleted.", messages: complaint.messages });
  } catch (err) {
    console.error("deleteComplaintMessage error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = {
  submitComplaint,
  getMyComplaints,
  getComplaintById,
  getAllComplaints,
  updateComplaintStatus,
  getComplaintsAgainstMe,
  replyToComplaint,
  buyerReplyToComplaint,
  sendComplaintMessage,
  editComplaintMessage,
  deleteComplaintMessage,
};
