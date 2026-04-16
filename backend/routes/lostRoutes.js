const express = require("express");
const router = express.Router();

const lostController = require("../controllers/lostcontroller");

router.post("/", lostController.createLost);
router.get("/", lostController.getAllLost);
router.get("/:id", lostController.getLostById);
router.put("/:id", lostController.updateLost);
router.delete("/:id", lostController.deleteLost);

module.exports = router;