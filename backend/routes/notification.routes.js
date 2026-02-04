const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  deleteNotification
} = require('../controllers/notification.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
