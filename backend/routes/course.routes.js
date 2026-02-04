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
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router
  .route('/')
  .get(getCourses)
  .post(authorize('Super Admin', 'Admin', 'Trainer'), createCourse);

router
  .route('/:id')
  .get(getCourse)
  .put(authorize('Super Admin', 'Admin', 'Trainer'), updateCourse)
  .delete(authorize('Super Admin', 'Admin'), deleteCourse);

router.post('/:id/enroll', enrollCourse);
router.put('/:id/progress', updateProgress);

module.exports = router;
