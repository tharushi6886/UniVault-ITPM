const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, getNotifications } = require('../controllers/messageController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/send', protect, sendMessage);
router.get('/notifications', protect, getNotifications);
router.get('/:userId', protect, getMessages);

module.exports = router;
