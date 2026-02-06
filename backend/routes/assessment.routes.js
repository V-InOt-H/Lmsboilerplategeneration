const express = require('express');
const router = express.Router();
const {
  getAssessments,
  getAssessment,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  submitAssessment,
  getResults
} = require('../controllers/assessment.controller');
const { protect, authorizeWithPermission, authorizeResource } = require('../middleware/auth.middleware');

router.use(protect);

// Get all assessments - requires authentication
router
  .route('/')
  .get(authorizeWithPermission('assessments:read'), getAssessments)
  .post(authorizeWithPermission('assessments:create'), createAssessment);

// Get single assessment - requires authentication
router
  .route('/:id')
  .get(authorizeWithPermission('assessments:read'), getAssessment)
  .put(authorizeResource('assessmentId'), authorizeWithPermission('assessments:update'), updateAssessment)
  .delete(authorizeWithPermission('assessments:delete'), deleteAssessment);

// Submit assessment - learners can submit their own
router.post('/:id/submit', submitAssessment);

// Get results - depends on role (own results or grading permission)
router.get('/:id/results', authorizeWithPermission('assessments:view-results'));

module.exports = router;
