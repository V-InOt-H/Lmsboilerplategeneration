const express = require('express');
const router = express.Router();
const {
  getCertificates,
  getCertificate,
  generateCertificate
} = require('../controllers/certificate.controller');
const { protect, authorizeWithPermission, authorizeResource } = require('../middleware/auth.middleware');

router.use(protect);

// Get all certificates - requires authentication
router.get('/', authorizeWithPermission('certificates:read'), getCertificates);

// Get single certificate - requires authentication
router.get('/:id', authorizeWithPermission('certificates:read'), getCertificate);

// Generate certificate - requires certificate:create permission
router.post('/generate', authorizeWithPermission('certificates:create'), generateCertificate);

module.exports = router;
