const User = require("../models/User");
const LostItem = require("../models/LostItem");
const FoundItem = require("../models/FoundItem");
const Lost = require("../models/lost");
const Item = require("../models/itemModels");

/**
 * Calculates a dynamic Trust Score (0-100) for a UniVault user.
 * 
 * Logic Breakdown:
 * - Verification (30 pts): isVerified === true
 * - Profile Completeness (20 pts): Image(8), Phone(6), Faculty(6)
 * - Found Items Returned (25 pts): +5 per resolved item (max 5)
 * - Marketplace Reliability (20 pts): +4 per successful sale (max 5)
 * - Account Longevity (5 pts): Accounts older than 30 days
 * 
 * @param {string} userId - The MongoDB ID of the user.
 * @returns {Promise<Object>} - { score, level, levelClass, breakdown }
 */
const calculateTrustScore = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    // Fetch dynamic stats in parallel
    const [newLostCount, oldLostCount, resolvedFoundCount, itemsPostedCount, itemsSoldCount] = await Promise.all([
      LostItem.countDocuments({ studentId: user.studentId }),
      Lost.countDocuments({ StudentId: user.studentId }),
      FoundItem.countDocuments({ studentId: user.studentId, status: "resolved" }),
      Item.countDocuments({ userId: user._id }),
      Item.countDocuments({ userId: user._id, availability_status: "not_available" })
    ]);

    let score = 0;
    const breakdown = [];

    // 1. Verification (30 pts)
    if (user.isVerified) {
      score += 30;
      breakdown.push({ label: "Verified Account", points: 30, max: 30 });
    } else {
      breakdown.push({ label: "Verified Account", points: 0, max: 30 });
    }

    // 2. Profile Completeness (20 pts)
    let profileScore = 0;
    if (user.profileImage) profileScore += 8;
    if (user.phone) profileScore += 6;
    if (user.faculty) profileScore += 6;
    score += profileScore;
    breakdown.push({ label: "Profile Completion", points: profileScore, max: 20 });

    // 3. Community contribution (25 pts)
    const foundPoints = Math.min(resolvedFoundCount * 5, 25);
    score += foundPoints;
    breakdown.push({ label: "Items Recovered", points: foundPoints, max: 25 });

    // 4. Marketplace Reliability (20 pts)
    const marketPoints = Math.min(itemsSoldCount * 4, 20);
    score += marketPoints;
    breakdown.push({ label: "Successful Trades", points: marketPoints, max: 20 });

    // 5. Longevity (5 pts)
    const daysSinceJoined = Math.floor((Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24));
    const longevityPoints = daysSinceJoined >= 30 ? 5 : 0;
    score += longevityPoints;
    breakdown.push({ label: "Account Longevity", points: longevityPoints, max: 5 });

    // Determine Level
    let level = "Low";
    let levelClass = "text-red-500";
    if (score >= 80) {
      level = "High";
      levelClass = "text-green-600";
    } else if (score >= 40) {
      level = "Medium";
      levelClass = "text-yellow-600";
    }

    return {
      score,
      level,
      levelClass,
      breakdown,
      stats: {
        lostReports: newLostCount + oldLostCount,
        foundReturned: resolvedFoundCount,
        itemsPosted: itemsPostedCount,
        itemsSold: itemsSoldCount
      }
    };
  } catch (error) {
    console.error("Trust calculation error:", error);
    return null;
  }
};

module.exports = calculateTrustScore;
