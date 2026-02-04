const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router
  .route('/')
  .get(authorize('Super Admin', 'Admin', 'HR'), getUsers)
  .post(authorize('Super Admin', 'Admin', 'HR'), createUser);

router
  .route('/:id')
  .get(getUser)
  .put(authorize('Super Admin', 'Admin', 'HR'), updateUser)
  .delete(authorize('Super Admin', 'Admin'), deleteUser);

module.exports = router;
