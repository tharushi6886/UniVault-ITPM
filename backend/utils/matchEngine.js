/**
 * Simple AI Match Engine for UniVault
 * Calculates similarity score between Lost and Found items
 */

const normalizeText = (text) => {
  if (!text) return "";
  return text.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
};

const calculateKeywordMatch = (text1, text2) => {
  const words1 = new Set(normalizeText(text1).split(/\s+/));
  const words2 = new Set(normalizeText(text2).split(/\s+/));
  
  if (words1.size === 0) return 0;
  
  let matches = 0;
  words1.forEach(word => {
    if (word.length > 2 && words2.has(word)) {
      matches++;
    }
  });
  
  return matches / Math.max(words1.size, 1);
};

const calculateDateCloseness = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffDays = Math.abs(d1 - d2) / (1000 * 60 * 60 * 24);
  
  if (diffDays <= 1) return 1;
  if (diffDays <= 3) return 0.7;
  if (diffDays <= 7) return 0.4;
  if (diffDays <= 14) return 0.2;
  return 0;
};

const calculateMatchScore = (lostItem, foundItem) => {
  let score = 0;
  const reasons = [];

  // Category Match (+30)
  if (normalizeText(lostItem.category) === normalizeText(foundItem.category)) {
    score += 30;
    reasons.push("Category matches perfectly");
  }

  // Item Name Similarity (+20)
  const nameSim = calculateKeywordMatch(lostItem.itemName, foundItem.itemName);
  if (nameSim > 0.5) {
    score += 20;
    reasons.push("Item names are very similar");
  } else if (nameSim > 0) {
    score += 10;
    reasons.push("Item names have some common keywords");
  }

  // Brand Match (+15)
  if (lostItem.brand && foundItem.brand && normalizeText(lostItem.brand) === normalizeText(foundItem.brand)) {
    score += 15;
    reasons.push(`Brand "${lostItem.brand}" matches`);
  }

  // Color Match (+10)
  if (lostItem.color && foundItem.color && normalizeText(lostItem.color) === normalizeText(foundItem.color)) {
    score += 10;
    reasons.push(`Color "${lostItem.color}" matches`);
  }

  // Location Similarity (+10)
  const locSim = calculateKeywordMatch(lostItem.location, foundItem.location);
  if (locSim > 0.5) {
    score += 10;
    reasons.push("Locations are very close or identical");
  } else if (locSim > 0) {
    score += 5;
    reasons.push("Locations share some common area keywords");
  }

  // Date Closeness (+10)
  const dateScore = calculateDateCloseness(lostItem.date, foundItem.date);
  if (dateScore > 0) {
    const points = Math.round(dateScore * 10);
    score += points;
    reasons.push("Reported dates are very close together");
  }

  // Description Similarity (+5)
  const descSim = calculateKeywordMatch(lostItem.description, foundItem.description);
  if (descSim > 0.3) {
    score += 5;
    reasons.push("Item descriptions have significant overlap");
  }

  return {
    score: Math.min(score, 100),
    reasons
  };
};

module.exports = {
  calculateMatchScore
};
