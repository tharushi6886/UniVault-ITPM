const User = require("../models/User");
const calculateTrustScore = require("./trustScore");

/**
 * Synchronizes the User's trust score and level fields in the database.
 * This should be called whenever a trust-impacting action occurs.
 */
const syncUserTrust = async (userId) => {
  try {
    const trustData = await calculateTrustScore(userId);
    if (trustData) {
      await User.findByIdAndUpdate(userId, {
        trustScore: trustData.totalScore,
        trustLevel: trustData.status
      });
    }
    return trustData;
  } catch (error) {
    console.error("Trust sync error:", error);
    return null;
  }
};

module.exports = syncUserTrust;
