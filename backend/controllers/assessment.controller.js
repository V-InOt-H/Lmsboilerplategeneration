const { Assessment, AssessmentResult } = require('../models/Assessment.model');
const Notification = require('../models/Notification.model');

// @desc    Get all assessments
// @route   GET /api/assessments
// @access  Private
exports.getAssessments = async (req, res) => {
  try {
    const { course, status } = req.query;
    const query = {};

    if (req.user.role === 'Learner') {
      query.status = 'Published';
    }

    if (course) query.course = course;
    if (status) query.status = status;

    const assessments = await Assessment.find(query)
      .populate('course', 'title')
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      count: assessments.length,
      assessments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single assessment
// @route   GET /api/assessments/:id
// @access  Private
exports.getAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate('course', 'title');

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Don't send correct answers to learners
    if (req.user.role === 'Learner') {
      assessment.questions = assessment.questions.map(q => ({
        _id: q._id,
        question: q.question,
        type: q.type,
        options: q.options,
        points: q.points
      }));
    }

    res.status(200).json({
      success: true,
      assessment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create assessment
// @route   POST /api/assessments
// @access  Private/Trainer/Admin
exports.createAssessment = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;

    const assessment = await Assessment.create(req.body);

    res.status(201).json({
      success: true,
      assessment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update assessment
// @route   PUT /api/assessments/:id
// @access  Private/Trainer/Admin
exports.updateAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    res.status(200).json({
      success: true,
      assessment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete assessment
// @route   DELETE /api/assessments/:id
// @access  Private/Admin
exports.deleteAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndDelete(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Assessment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Submit assessment
// @route   POST /api/assessments/:id/submit
// @access  Private/Learner
exports.submitAssessment = async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;

    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Check attempt count
    const previousAttempts = await AssessmentResult.countDocuments({
      assessment: assessment._id,
      user: req.user.id
    });

    if (previousAttempts >= assessment.attempts) {
      return res.status(400).json({
        success: false,
        message: 'Maximum attempts reached'
      });
    }

    // Auto-evaluate
    let totalPoints = 0;
    let earnedPoints = 0;
    const evaluatedAnswers = [];

    assessment.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      totalPoints += question.points;
      if (isCorrect) {
        earnedPoints += question.points;
      }

      evaluatedAnswers.push({
        question: question._id,
        selectedAnswer: userAnswer,
        isCorrect,
        points: isCorrect ? question.points : 0
      });
    });

    const percentage = (earnedPoints / totalPoints) * 100;
    const passed = percentage >= assessment.passingScore;

    // Save result
    const result = await AssessmentResult.create({
      assessment: assessment._id,
      user: req.user.id,
      answers: evaluatedAnswers,
      score: earnedPoints,
      percentage,
      passed,
      attemptNumber: previousAttempts + 1,
      timeTaken
    });

    // Create notification
    await Notification.create({
      user: req.user.id,
      type: 'Assessment',
      title: passed ? 'Assessment Passed!' : 'Assessment Completed',
      message: `You scored ${percentage.toFixed(0)}% on ${assessment.title}`,
      link: `/assessments/${assessment._id}/results/${result._id}`,
      metadata: {
        assessment: assessment._id
      }
    });

    res.status(200).json({
      success: true,
      result: {
        score: earnedPoints,
        totalPoints,
        percentage,
        passed,
        attemptNumber: previousAttempts + 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get assessment results
// @route   GET /api/assessments/:id/results
// @access  Private
exports.getResults = async (req, res) => {
  try {
    const results = await AssessmentResult.find({
      assessment: req.params.id,
      user: req.user.id
    }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: results.length,
      results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
