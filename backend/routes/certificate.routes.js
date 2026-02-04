const express = require('express');
const router = express.Router();
const {
  getCertificates,
  getCertificate,
  generateCertificate
} = require('../controllers/certificate.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', getCertificates);
router.get('/:id', getCertificate);
router.post('/generate', generateCertificate);

module.exports = router;
