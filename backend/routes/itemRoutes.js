const express = require("express");
const router = express.Router();

const itemController = require("../controllers/itemController");

// GET all items
router.get("/", itemController.getAllItems);

// ADD item
router.post("/", itemController.addItems);

module.exports = router;