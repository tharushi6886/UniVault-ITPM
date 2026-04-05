const express = require("express");
const router = express.Router();
const { createFoundItem, getAllFoundItems, updateFoundItem, deleteFoundItem } = require("../controllers/foundItemController");

router.post("/", createFoundItem);
router.get("/", getAllFoundItems);
router.put("/:id", updateFoundItem);
router.delete("/:id", deleteFoundItem);

module.exports = router;
