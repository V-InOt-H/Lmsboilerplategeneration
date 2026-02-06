const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  updateProgress
} = require('../controllers/course.controller');
const { protect, authorizeWithPermission, authorizeResource } = require('../middleware/auth.middleware');

router.use(protect);

// Get all courses - any authenticated user can view courses
router
  .route('/')
  .get(authorizeWithPermission('courses:read'), getCourses)
  .post(authorizeWithPermission('courses:create'), createCourse);

// Get single course - requires authentication
router
  .route('/:id')
  .get(authorizeWithPermission('courses:read'), getCourse)
  .put(authorizeResource('courseId'), authorizeWithPermission('courses:update'), updateCourse)
  .delete(authorizeWithPermission('courses:delete'), deleteCourse);

// Enroll in a course - users can enroll themselves
router.post('/:id/enroll', enrollCourse);

// Update progress - users can update their own progress
router.put('/:id/progress', updateProgress);

module.exports = router;
