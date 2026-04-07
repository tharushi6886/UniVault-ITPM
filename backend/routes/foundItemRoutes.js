const express = require("express");
const router = express.Router();
const { createFoundItem, getAllFoundItems, updateFoundItem, deleteFoundItem, getMyFoundItems, getFoundItemById } = require("../controllers/foundItemController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/my-items", protect, getMyFoundItems);
router.post("/", createFoundItem);
router.get("/", getAllFoundItems);
router.put("/:id", updateFoundItem);
router.delete("/:id", deleteFoundItem);
router.get("/:id", getFoundItemById);

module.exports = router;
