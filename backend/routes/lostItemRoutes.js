const express = require("express");
const router = express.Router();
const { createLostItem, getAllLostItems, updateLostItem, deleteLostItem, getMyLostItems, getLostItemById, notifyUser } = require("../controllers/lostItemController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/my-items", protect, getMyLostItems);
router.post("/", createLostItem);
router.get("/", getAllLostItems);
router.put("/:id", updateLostItem);
router.delete("/:id", deleteLostItem);
router.post("/:id/notify", notifyUser);
router.get("/:id", getLostItemById);

module.exports = router;
