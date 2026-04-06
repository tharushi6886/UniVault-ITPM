const express = require("express");
const router = express.Router();

const itemController = require("../controllers/itemController");
const { protect } = require("../middlewares/authMiddleware");

// GET my items
router.get("/my-items", protect, itemController.getMyItems);

// GET all items
router.get("/", itemController.getAllItems);

// ADD item
router.post("/", itemController.addItems);

module.exports = router;