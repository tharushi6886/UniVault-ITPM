const User = require("../models/User");
const calculateTrustScore = require("./trustScore");

/**
 * Synchronizes the User's trust score and level fields in the database.
 * This should be called whenever a trust-impacting action occurs.
 */
const syncUserTrust = async (userId, eventName = null) => {
  try {
    const trustData = await calculateTrustScore(userId);
    if (trustData) {
      const user = await User.findById(userId);
      if (!user) return null;

      const oldScore = user.trustScore || 0;
      const newScore = trustData.totalScore;

      const updateData = {
        trustScore: newScore,
        trustLevel: trustData.status
      };

      // Only log if an event name is provided OR if the score changed significantly (>1pt)
      // This prevents spamming history with minor automated syncs
      if (eventName || Math.abs(newScore - oldScore) >= 1) {
        const historyEntry = {
          event: eventName || (newScore > oldScore ? "Reputation Increase" : "Reputation Adjust"),
          points: newScore,
          date: new Date()
        };
        
        // Push to history and keep only last 20 events to avoid document size issues
        updateData.$push = { 
          reputationHistory: { 
            $each: [historyEntry],
            $slice: -20 
          } 
        };
      }

      await User.findByIdAndUpdate(userId, updateData);
    }
    return trustData;
  } catch (error) {
    console.error("Trust sync error:", error);
    return null;
  }
};

module.exports = syncUserTrust;
