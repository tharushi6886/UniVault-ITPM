const express = require("express");
const router = express.Router();
const { createLostItem, getAllLostItems, updateLostItem, deleteLostItem } = require("../controllers/lostItemController");

router.post("/", createLostItem);
router.get("/", getAllLostItems);
router.put("/:id", updateLostItem);
router.delete("/:id", deleteLostItem);

module.exports = router;
