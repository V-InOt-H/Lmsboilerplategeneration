const User = require('../models/User.model');
const Course = require('../models/Course.model');
const { AssessmentResult } = require('../models/Assessment.model');
const Certificate = require('../models/Certificate.model');

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin/Trainer
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalCertificates = await Certificate.countDocuments();
    
    const activeUsers = await User.countDocuments({ status: 'Active' });
    const publishedCourses = await Course.countDocuments({ status: 'Published' });

    // Enrollment stats
    const users = await User.find().select('enrolledCourses');
    let totalEnrollments = 0;
    let completedCourses = 0;
    
    users.forEach(user => {
      totalEnrollments += user.enrolledCourses.length;
      completedCourses += user.enrolledCourses.filter(e => e.status === 'Completed').length;
    });

    // Assessment stats
    const assessmentResults = await AssessmentResult.find();
    const passedAssessments = assessmentResults.filter(r => r.passed).length;
    const averageScore = assessmentResults.length > 0
      ? assessmentResults.reduce((sum, r) => sum + r.percentage, 0) / assessmentResults.length
      : 0;

    // Top courses
    const topCourses = await Course.find({ status: 'Published' })
      .sort({ 'enrolledUsers.length': -1 })
      .limit(5)
      .select('title enrolledUsers category');

    // Recent enrollments
    const recentEnrollments = await User.find()
      .select('name email enrolledCourses')
      .populate('enrolledCourses.course', 'title')
      .sort('-enrolledCourses.enrolledAt')
      .limit(10);

    res.status(200).json({
      success: true,
      analytics: {
        overview: {
          totalUsers,
          activeUsers,
          totalCourses,
          publishedCourses,
          totalEnrollments,
          completedCourses,
          totalCertificates
        },
        assessments: {
          totalAttempts: assessmentResults.length,
          passedAssessments,
          averageScore: averageScore.toFixed(2)
        },
        topCourses,
        recentEnrollments
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get learner analytics
// @route   GET /api/analytics/learner
// @access  Private/Learner
exports.getLearnerAnalytics = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('enrolledCourses.course', 'title category duration');

    const certificates = await Certificate.find({ user: req.user.id });
    const assessmentResults = await AssessmentResult.find({ user: req.user.id })
      .populate('assessment', 'title');

    const totalCourses = user.enrolledCourses.length;
    const completedCourses = user.enrolledCourses.filter(e => e.status === 'Completed').length;
    const inProgressCourses = totalCourses - completedCourses;
    
    const averageProgress = totalCourses > 0
      ? user.enrolledCourses.reduce((sum, e) => sum + e.progress, 0) / totalCourses
      : 0;

    const passedAssessments = assessmentResults.filter(r => r.passed).length;
    const averageAssessmentScore = assessmentResults.length > 0
      ? assessmentResults.reduce((sum, r) => sum + r.percentage, 0) / assessmentResults.length
      : 0;

    res.status(200).json({
      success: true,
      analytics: {
        courses: {
          total: totalCourses,
          completed: completedCourses,
          inProgress: inProgressCourses,
          averageProgress: averageProgress.toFixed(2)
        },
        assessments: {
          total: assessmentResults.length,
          passed: passedAssessments,
          averageScore: averageAssessmentScore.toFixed(2)
        },
        certificates: {
          total: certificates.length
        },
        enrolledCourses: user.enrolledCourses,
        recentAssessments: assessmentResults.slice(0, 5)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get course analytics
// @route   GET /api/analytics/course/:id
// @access  Private/Admin/Trainer
exports.getCourseAnalytics = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('enrolledUsers', 'name email');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const users = await User.find({
      'enrolledCourses.course': course._id
    }).select('name email enrolledCourses');

    const enrollmentData = users.map(user => {
      const enrollment = user.enrolledCourses.find(
        e => e.course.toString() === course._id.toString()
      );
      return {
        user: {
          name: user.name,
          email: user.email
        },
        enrolledAt: enrollment.enrolledAt,
        progress: enrollment.progress,
        status: enrollment.status
      };
    });

    const completedCount = enrollmentData.filter(e => e.status === 'Completed').length;
    const averageProgress = enrollmentData.length > 0
      ? enrollmentData.reduce((sum, e) => sum + e.progress, 0) / enrollmentData.length
      : 0;

    res.status(200).json({
      success: true,
      analytics: {
        course: {
          title: course.title,
          totalEnrollments: enrollmentData.length,
          completed: completedCount,
          averageProgress: averageProgress.toFixed(2)
        },
        enrollments: enrollmentData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Export report to CSV
// @route   GET /api/analytics/export
// @access  Private/Admin/Trainer
exports.exportReport = async (req, res) => {
  try {
    const { type } = req.query; // 'users', 'courses', 'enrollments', 'assessments'

    let data = [];
    let headers = [];

    switch (type) {
      case 'users':
        const users = await User.find().select('-password');
        headers = ['Name', 'Email', 'Role', 'Status', 'Department', 'Created At'];
        data = users.map(u => [
          u.name,
          u.email,
          u.role,
          u.status,
          u.department || 'N/A',
          new Date(u.createdAt).toLocaleDateString()
        ]);
        break;

      case 'courses':
        const courses = await Course.find();
        headers = ['Title', 'Category', 'Level', 'Status', 'Enrollments', 'Duration'];
        data = courses.map(c => [
          c.title,
          c.category,
          c.level,
          c.status,
          c.enrolledUsers.length,
          `${c.duration} mins`
        ]);
        break;

      case 'assessments':
        const results = await AssessmentResult.find()
          .populate('user', 'name email')
          .populate('assessment', 'title');
        headers = ['User', 'Assessment', 'Score', 'Percentage', 'Passed', 'Date'];
        data = results.map(r => [
          r.user.name,
          r.assessment.title,
          r.score,
          `${r.percentage.toFixed(2)}%`,
          r.passed ? 'Yes' : 'No',
          new Date(r.createdAt).toLocaleDateString()
        ]);
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid export type'
        });
    }

    // Convert to CSV
    const csv = [
      headers.join(','),
      ...data.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${type}-report.csv`);
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
