const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings
} = require('../controllers/settings.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.use(authorize('Super Admin', 'Admin'));

router.route('/')
  .get(getSettings)
  .put(updateSettings);

module.exports = router;
