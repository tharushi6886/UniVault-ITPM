const express = require("express");
const router = express.Router();

const itemController = require("../controllers/itemController");
const { protect } = require("../middlewares/authMiddleware");

// GET my items
router.get("/my-items", protect, itemController.getMyItems);

// GET all items
router.get("/", itemController.getAllItems);

// GET single item
router.get("/:id", itemController.getItemById);

// UPDATE item
router.put("/:id", protect, itemController.updateItem);

// ADD item
router.post("/", protect, itemController.addItems);

module.exports = router;