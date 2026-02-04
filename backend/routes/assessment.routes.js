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
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router
  .route('/')
  .get(getAssessments)
  .post(authorize('Super Admin', 'Admin', 'Trainer'), createAssessment);

router
  .route('/:id')
  .get(getAssessment)
  .put(authorize('Super Admin', 'Admin', 'Trainer'), updateAssessment)
  .delete(authorize('Super Admin', 'Admin'), deleteAssessment);

router.post('/:id/submit', submitAssessment);
router.get('/:id/results', getResults);

module.exports = router;
