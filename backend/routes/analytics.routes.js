const express = require('express');
const router = express.Router();
const {
  getDashboardAnalytics,
  getLearnerAnalytics,
  getCourseAnalytics,
  exportReport
} = require('../controllers/analytics.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/dashboard', authorize('Super Admin', 'Admin', 'Trainer'), getDashboardAnalytics);
router.get('/learner', getLearnerAnalytics);
router.get('/course/:id', authorize('Super Admin', 'Admin', 'Trainer'), getCourseAnalytics);
router.get('/export', authorize('Super Admin', 'Admin', 'Trainer'), exportReport);

module.exports = router;
