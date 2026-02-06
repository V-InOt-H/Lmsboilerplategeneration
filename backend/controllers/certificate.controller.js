const Certificate = require('../models/Certificate.model');
const User = require('../models/User.model');
const Course = require('../models/Course.model');

// @desc    Get all certificates for user
// @route   GET /api/certificates
// @access  Private
exports.getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ user: req.user.id })
      .populate('course', 'title category')
      .sort('-issuedDate');

    res.status(200).json({
      success: true,
      count: certificates.length,
      certificates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single certificate by ID
// @route   GET /api/certificates/:id
// @access  Private
exports.getCertificate = async (req, res) => {
  try {
    // Try to find by _id first
    let certificate = await Certificate.findById(req.params.id)
      .populate('user', 'name email')
      .populate('course', 'title description category');

    // If not found, try by certificateNumber
    if (!certificate) {
      certificate = await Certificate.findOne({ certificateNumber: req.params.id })
        .populate('user', 'name email')
        .populate('course', 'title description category');
    }

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    res.status(200).json({
      success: true,
      certificate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Generate certificate
// @route   POST /api/certificates/generate
// @access  Private
exports.generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.body;

    const user = await User.findById(req.user.id);
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user completed the course (100% progress)
    const enrollment = user.enrolledCourses.find(
      e => e.course.toString() === courseId && e.status === 'Completed'
    );

    if (!enrollment) {
      return res.status(400).json({
        success: false,
        message: 'Course not completed. Complete 100% to get certificate.'
      });
    }

    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({
      user: user._id,
      course: course._id
    });

    if (existingCertificate) {
      return res.status(400).json({
        success: false,
        message: 'Certificate already generated',
        certificate: existingCertificate
      });
    }

    // Generate certificate - the model will auto-generate certificateNumber
    const certificate = await Certificate.create({
      user: user._id,
      course: course._id,
      completionDate: Date.now(),
      finalScore: enrollment.progress,
      issuedDate: Date.now()
    });

    await certificate.populate([
      { path: 'user', select: 'name email' },
      { path: 'course', select: 'title category' }
    ]);

    res.status(201).json({
      success: true,
      certificate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Verify certificate
// @route   GET /api/certificates/verify/:certificateNumber
// @access  Public
exports.verifyCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ 
      certificateNumber: req.params.certificateNumber 
    })
      .populate('user', 'name')
      .populate('course', 'title');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    res.status(200).json({
      success: true,
      verification: {
        valid: true,
        certificateNumber: certificate.certificateNumber,
        learnerName: certificate.user?.name,
        courseName: certificate.course?.title,
        completionDate: certificate.completionDate,
        issuedDate: certificate.issuedDate
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

