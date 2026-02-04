const express = require('express');
const router = express.Router();
const {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle
} = require('../controllers/knowledge.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router
  .route('/')
  .get(getArticles)
  .post(authorize('Super Admin', 'Admin', 'Trainer'), createArticle);

router
  .route('/:id')
  .get(getArticle)
  .put(authorize('Super Admin', 'Admin', 'Trainer'), updateArticle)
  .delete(authorize('Super Admin', 'Admin'), deleteArticle);

module.exports = router;
