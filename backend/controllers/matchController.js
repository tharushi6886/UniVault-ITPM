const LostItem = require("../models/LostItem");
const FoundItem = require("../models/FoundItem");
const Match = require("../models/Match");
const { calculateMatchScore } = require("../utils/matchEngine");

// GET /api/matches/scan/:lostItemId
const scanMatchesForLostItem = async (req, res) => {
  try {
    const { lostItemId } = req.params;
    const lostItem = await LostItem.findById(lostItemId);
    
    if (!lostItem) {
      return res.status(404).json({ message: "Lost item not found" });
    }

    // Only compare with found items that are still available
    const availableFoundItems = await FoundItem.find({ status: "available" });
    
    // Remove old matches for this lost item before scanning again
    await Match.deleteMany({ lostItemId });

    const potentialMatches = [];

    for (const foundItem of availableFoundItems) {
      const { score, reasons } = calculateMatchScore(lostItem, foundItem);
      
      // Only keep matches with a score > 10%
      if (score > 10) {
        potentialMatches.push({
          lostItemId,
          foundItemId: foundItem._id,
          score,
          reasons,
          status: "suggested"
        });
      }
    }

    // Sort by score descending and take top 10
    potentialMatches.sort((a, b) => b.score - a.score);
    const topMatches = potentialMatches.slice(0, 10);

    // Save matches to database
    const savedMatches = await Match.insertMany(topMatches);

    // Populate the response with item details
    const populatedMatches = await Match.find({ _id: { $in: savedMatches.map(m => m._id) } })
      .populate("lostItemId")
      .populate("foundItemId");

    res.status(200).json(populatedMatches);
  } catch (error) {
    console.error("Scan matches error:", error);
    res.status(500).json({ message: "Error scanning matches", error: error.message });
  }
};

// GET /api/matches/lost-item/:lostItemId
const getMatchesForLostItem = async (req, res) => {
  try {
    const { lostItemId } = req.params;
    const matches = await Match.find({ lostItemId, status: { $ne: "rejected" } })
      .populate("lostItemId")
      .populate("foundItemId")
      .sort({ score: -1 });

    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: "Error fetching matches", error: error.message });
  }
};

// PATCH /api/matches/verify/:matchId
const verifyMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const match = await Match.findByIdAndUpdate(
      matchId,
      { status: "verified" },
      { new: true }
    ).populate("lostItemId").populate("foundItemId");

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    res.status(200).json(match);
  } catch (error) {
    res.status(500).json({ message: "Error verifying match", error: error.message });
  }
};

// PATCH /api/matches/reject/:matchId
const rejectMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const match = await Match.findByIdAndUpdate(
      matchId,
      { status: "rejected" },
      { new: true }
    );

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    res.status(200).json({ message: "Match rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting match", error: error.message });
  }
};

module.exports = {
  scanMatchesForLostItem,
  getMatchesForLostItem,
  verifyMatch,
  rejectMatch
};
