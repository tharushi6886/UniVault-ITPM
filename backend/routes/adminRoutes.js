const express = require("express");
const router = express.Router();
const { getActivityLog, getUsersForExport } = require("../controllers/adminController");

router.get("/activity-log", getActivityLog);
router.get("/users/export", getUsersForExport);

module.exports = router;
