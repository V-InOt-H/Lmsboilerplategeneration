const express = require('express');
const router = express.Router();
const {
  getCertificates,
  getCertificate,
  generateCertificate,
  verifyCertificate
} = require('../controllers/certificate.controller');
const { protect, authorizeWithPermission } = require('../middleware/auth.middleware');

router.use(protect);

// Get all certificates - requires authentication
router.get('/', getCertificates);

// Generate certificate - requires courses:write permission (for self-enrollment)
router.post('/generate', authorizeWithPermission('courses:write'), generateCertificate);

// Verify certificate - public route
router.get('/verify/:certificateId', verifyCertificate);

// Get single certificate by ID or certificateId
router.get('/:id', getCertificate);

module.exports = router;

