const express = require("express");
const router = express.Router();
const { createLostItem, getAllLostItems, updateLostItem, deleteLostItem, getMyLostItems } = require("../controllers/lostItemController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/my-items", protect, getMyLostItems);
router.post("/", createLostItem);
router.get("/", getAllLostItems);
router.put("/:id", updateLostItem);
router.delete("/:id", deleteLostItem);

module.exports = router;
