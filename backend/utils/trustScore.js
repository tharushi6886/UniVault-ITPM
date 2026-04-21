const User = require("../models/User");
const LostItem = require("../models/LostItem");
const FoundItem = require("../models/FoundItem");
const Lost = require("../models/lost");
const Item = require("../models/itemModels");
const Review = require("../models/Review");

/**
 * Calculates a dynamic Trust Score (0-100) for a UniVault user.
 * 
 * Logic Breakdown (100 Base Pts + Modifiers):
 * 1. Identity Verification (30 pts)
 * 2. Profile Integrity (20 pts)
 * 3. Community Contribution (25 pts) — Found Items Returned
 * 4. Marketplace Trust (20 pts) — Successful Sales
 * 5. Account Longevity (2 pts) — Older than 30 days
 * 6. Peer Review Score (10 pts) — Avg rating * 2
 * 7. Response Rate (5 pts) — Response speed
 */
const calculateTrustScore = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    // Fetch dynamic stats in parallel
    const [
      newLostCount, 
      oldLostCount, 
      resolvedFoundCount, 
      itemsPostedCount, 
      itemsSoldCount,
      reviews
    ] = await Promise.all([
      LostItem.countDocuments({ studentId: user.studentId }),
      Lost.countDocuments({ StudentId: user.studentId }),
      FoundItem.countDocuments({ studentId: user.studentId, status: "resolved" }),
      Item.countDocuments({ userId: user._id }),
      Item.countDocuments({ userId: user._id, availability_status: "not_available" }),
      Review.find({ reviewed: userId })
    ]);

    const metrics = user.trustMetrics || { disputedTransactions: 0, falseLostReports: 0, respondedCount: 0, totalMessagesReceived: 0 };
    
    let totalScore = 0;
    const pillars = {};

    // 1. Identity Verification (30 pts)
    const verificationScore = user.isVerified ? 30 : 0;
    totalScore += verificationScore;
    pillars.identityVerification = { earned: verificationScore, max: 30 };

    // 2. Profile Integrity (20 pts)
    let profileScore = 0;
    if (user.profileImage) profileScore += 8;
    if (user.phone) profileScore += 6;
    if (user.faculty) profileScore += 6;
    totalScore += profileScore;
    pillars.profileIntegrity = { earned: profileScore, max: 20 };

    // 3. Community Hero (25 pts)
    const communityPoints = Math.min(resolvedFoundCount * 5, 25);
    totalScore += communityPoints;
    pillars.communityHero = { earned: communityPoints, max: 25 };

    // 4. Marketplace Trust (20 pts)
    const marketPoints = Math.min(itemsSoldCount * 4, 20);
    totalScore += marketPoints;
    pillars.marketplaceTrust = { earned: marketPoints, max: 20 };

    // 5. Account Longevity (2 pts)
    const daysSinceJoined = Math.floor((Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24));
    const longevityPoints = daysSinceJoined >= 30 ? 2 : 0;
    totalScore += longevityPoints;
    pillars.accountLongevity = { earned: longevityPoints, max: 2 };

    // 6. Peer Review Score (10 pts)
    let peerPoints = 0;
    const activeReviews = reviews.filter(r => !r.isDeleted);
    if (activeReviews.length > 0) {
      const verified = activeReviews.filter(r => r.isVerified);
      const unverified = activeReviews.filter(r => !r.isVerified);
      
      let vScore = 0;
      if (verified.length > 0) {
        vScore = (verified.reduce((acc, r) => acc + r.rating, 0) / verified.length) * 1.4; // max 7
      }
      
      let uScore = 0;
      if (unverified.length > 0) {
        uScore = (unverified.reduce((acc, r) => acc + r.rating, 0) / unverified.length) * 0.6; // max 3
      } else if (verified.length > 0) {
        // If they have verified but no unverified, give them a small bonus for the missing 30%
        uScore = 0; 
      }
      
      peerPoints = Math.round(vScore + uScore);
    }
    totalScore += peerPoints;
    pillars.peerReview = { earned: peerPoints, max: 10 };

    // 7. Response Rate (3 pts) — Reduced slightly to fit 100 base
    let responsePoints = 0;
    if (metrics.totalMessagesReceived > 0) {
      responsePoints = Math.round((metrics.respondedCount / metrics.totalMessagesReceived) * 3);
    } else {
        responsePoints = 3; // Benefit of the doubt for new users
    }
    totalScore += responsePoints;
    pillars.responseRate = { earned: responsePoints, max: 3 };

    // 8. Engagement & Activity (8 pts) — NEW: Rewards for helping (Anti-spam capped)
    const activeFoundCount = await FoundItem.countDocuments({ studentId: user.studentId, status: "active" });
    const activeLostCount = await LostItem.countDocuments({ studentId: user.studentId, status: "active" });
    
    const foundEngagementPoints = Math.min(activeFoundCount * 2, 5); // +2 per found, cap 5
    const lostEngagementPoints = Math.min(activeLostCount * 1, 3);   // +1 per lost, cap 3
    
    const engagementScore = foundEngagementPoints + lostEngagementPoints;
    totalScore += engagementScore;
    pillars.engagement = { earned: engagementScore, max: 8 };

    // MODIFIERS (Applied to final score)
    let penalties = 0;
    let bonuses = 0;

    // Penalty: Disputed Transactions
    if (metrics.disputedTransactions >= 2) {
      penalties -= 5;
    }

    // Penalty: False Lost Reports
    if (metrics.falseLostReports > 0) {
      penalties -= 10;
    }

    // Bonus: Excellence (3+ five-star reviews)
    const fiveStarCount = reviews.filter(r => r.rating === 5).length;
    if (fiveStarCount >= 3) {
      bonuses += 5;
    }

    // Calculate Final Total
    let finalScore = totalScore + penalties + bonuses;
    finalScore = Math.max(0, Math.min(100, finalScore)); // CLAMP 0-100

    // Determine Tier (Revised Plan)
    let status = "Improving";
    if (finalScore >= 80) status = "Elite";
    else if (finalScore >= 65) status = "Trusted";
    else if (finalScore >= 40) status = "Standard";

    // Next Milestone Logic
    let nextMilestone = { label: "Standard", pointsNeeded: 40 - finalScore };
    if (finalScore >= 80) nextMilestone = { label: "Elite", pointsNeeded: 0 };
    else if (finalScore >= 65) nextMilestone = { label: "Elite", pointsNeeded: 80 - finalScore };
    else if (finalScore >= 40) nextMilestone = { label: "Trusted", pointsNeeded: 65 - finalScore };

    return {
      totalScore: finalScore,
      status,
      pillars,
      penalties,
      bonuses,
      nextMilestone,
      lastAudit: metrics.lastAuditDate,
      stats: {
        lostReports: newLostCount + oldLostCount,
        foundReturned: resolvedFoundCount,
        itemsPosted: itemsPostedCount,
        itemsSold: itemsSoldCount,
        reviewCount: reviews.length,
        avgRating: reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0
      }
    };
  } catch (error) {
    console.error("Trust calculation error:", error);
    return null;
  }
};

module.exports = calculateTrustScore;
