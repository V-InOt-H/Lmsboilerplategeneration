const Course = require('../models/Course.model');
const User = require('../models/User.model');
const Notification = require('../models/Notification.model');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
exports.getCourses = async (req, res) => {
  try {
    const { status, category, level } = req.query;
    const query = {};

    // Learners only see published courses
    if (req.user.role === 'Learner') {
      query.status = 'Published';
    }

    if (status) query.status = status;
    if (category) query.category = category;
    if (level) query.level = level;

    const courses = await Course.find(query)
      .populate('createdBy', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Private
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('createdBy', 'name email avatar');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Trainer/Admin
exports.createCourse = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;

    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Trainer/Admin
exports.updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Remove course from all users' enrolledCourses arrays
    await User.updateMany(
      { 'enrolledCourses.course': course._id },
      { $pull: { enrolledCourses: { course: course._id } } }
    );

    // Delete the course
    await Course.findByIdAndDelete(course._id);

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private/Learner
exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const user = await User.findById(req.user.id);

    // Check if already enrolled
    const alreadyEnrolled = user.enrolledCourses.some(
      enrollment => enrollment.course.toString() === course._id.toString()
    );

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Enroll user
    user.enrolledCourses.push({
      course: course._id,
      enrolledAt: Date.now(),
      progress: 0,
      status: 'In Progress'
    });

    await user.save();

    // Add user to course
    course.enrolledUsers.push(user._id);
    await course.save();

    // Create notification
    await Notification.create({
      user: user._id,
      type: 'Enrollment',
      title: 'Course Enrollment Successful',
      message: `You have successfully enrolled in ${course.title}`,
      link: `/courses/${course._id}`
    });

    res.status(200).json({
      success: true,
      message: 'Successfully enrolled in course'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update course progress
// @route   PUT /api/courses/:id/progress
// @access  Private/Learner
exports.updateProgress = async (req, res) => {
  try {
    const { lessonId, progress } = req.body;
    const user = await User.findById(req.user.id);

    const enrollment = user.enrolledCourses.find(
      e => e.course.toString() === req.params.id
    );

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Not enrolled in this course'
      });
    }

    // Add completed lesson
    if (lessonId && !enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    // Update progress
    if (progress !== undefined) {
      enrollment.progress = progress;
      if (progress >= 100) {
        enrollment.status = 'Completed';
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
