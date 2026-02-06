const express = require('express');
const router = express.Router();
const {
  getAllEnrollments,
  getUserEnrollments,
  getCourseEnrollments,
  bulkEnrollUsers,
  enrollUser,
  updateEnrollment,
  removeEnrollment,
  getEnrollmentStats
} = require('../controllers/enrollment.controller');
const { protect, authorizeWithPermission } = require('../middleware/auth.middleware');

router.use(protect);

// Get enrollment statistics - requires analytics:read permission
router.get('/stats', authorizeWithPermission('analytics:read'), getEnrollmentStats);

// Get all enrollments with filtering - requires users:read permission
router.get('/', authorizeWithPermission('users:read'), getAllEnrollments);

// Bulk enroll users - requires users:write permission
router.post('/bulk', authorizeWithPermission('users:write'), bulkEnrollUsers);

// Enroll a single user - requires users:write permission
router.post('/', authorizeWithPermission('users:write'), enrollUser);

// Get enrollments for a specific user
router.get('/user/:userId', authorizeWithPermission('users:read'), getUserEnrollments);

// Get enrollments for a specific course
router.get('/course/:courseId', authorizeWithPermission('courses:read'), getCourseEnrollments);

// Update enrollment progress
router.put('/:userId/:courseId', authorizeWithPermission('users:write'), updateEnrollment);

// Remove enrollment - requires users:delete permission
router.delete('/:userId/:courseId', authorizeWithPermission('users:delete'), removeEnrollment);

module.exports = router;

