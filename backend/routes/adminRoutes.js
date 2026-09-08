const express = require("express");
const router = express.Router();
const { 
  getActivityLog, 
  getUsersForExport, 
  getAllOrders, 
  deleteOrder, 
  deleteMarketplaceItem 
} = require("../controllers/adminController");
const { protect } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

router.get("/activity-log", protect, authorizeRoles("Admin"), getActivityLog);
router.get("/users/export", protect, authorizeRoles("Admin"), getUsersForExport);
router.get("/orders", protect, authorizeRoles("Admin"), getAllOrders);
router.delete("/orders/:id", protect, authorizeRoles("Admin"), deleteOrder);
router.delete("/items/:id", protect, authorizeRoles("Admin"), deleteMarketplaceItem);

module.exports = router;
