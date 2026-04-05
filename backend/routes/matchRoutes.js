const express = require("express");
const router = express.Router();
const {
  scanMatchesForLostItem,
  getMatchesForLostItem,
  verifyMatch,
  rejectMatch
} = require("../controllers/matchController");

// Scan for matches between a lost item and all available found items
router.get("/scan/:lostItemId", scanMatchesForLostItem);

// Get previously scanned matches for a specific lost item
router.get("/lost-item/:lostItemId", getMatchesForLostItem);

// Verify a match between lost and found item
router.patch("/verify/:matchId", verifyMatch);

// Reject a match suggestion
router.patch("/reject/:matchId", rejectMatch);

module.exports = router;
