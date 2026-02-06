# Fix: Deleted courses should not show in learner dashboard

## Task
When a course is deleted by admin, it should not appear in the learner's dashboard even if they were enrolled.

## Root Cause
- `deleteCourse()` doesn't clean up enrollment references from User collection
- `getLearnerAnalytics()` doesn't filter out orphaned enrollments

## Completed Changes

### 1. `backend/controllers/course.controller.js` - deleteCourse function
Modified to remove the course from all users' enrolledCourses arrays BEFORE deleting the course:
```javascript
// Remove course from all users' enrolledCourses arrays
await User.updateMany(
  { 'enrolledCourses.course': course._id },
  { $pull: { enrolledCourses: { course: course._id } } }
);

// Delete the course
await Course.findByIdAndDelete(course._id);
```

### 2. `backend/controllers/analytics.controller.js` - getLearnerAnalytics function
Added filtering for orphaned enrollments as a safety measure:
```javascript
// Filter out orphaned enrollments (courses that have been deleted)
const validEnrolledCourses = user.enrolledCourses.filter(
  enrollment => enrollment.course !== null
);
```

### 3. `backend/controllers/enrollment.controller.js` - getUserEnrollments function
Added filtering for orphaned enrollments:
```javascript
// Filter out orphaned enrollments (courses that have been deleted)
const validEnrollments = user.enrolledCourses.filter(
  enrollment => enrollment.course !== null
);
```

## Result
✅ When admin deletes a course, all enrollment references are automatically removed from users' accounts
✅ Deleted courses no longer appear in learner dashboards
✅ Analytics correctly reflect only active enrollments

