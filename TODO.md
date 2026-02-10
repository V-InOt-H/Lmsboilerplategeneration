# Continue Button & Course-Assessment-Certificate Flow Fix

## Issue Analysis
Current flow problem:
- Course completion → Auto-check certificate → Certificate shown if assessment passed 90%+
- This bypasses the requirement to actually TAKE the assessment

## Required Flow
1. Course completion → Show "Take Assessment" CTA (no certificate)
2. Assessment completion with 90%+ → Allow certificate generation
3. Certificate shown only after assessment is passed

## Implementation Summary

### Changes Made:

#### 1. CourseViewer.tsx
- ✅ Updated `useEffect` to check assessment status only when course is completed
- ✅ Added comments explaining certificate should only appear after assessment
- ✅ Combined assessment buttons (Start/Retake) into one unified section
- ✅ Certificate now only appears after assessment passed with 90%+

#### 2. LearnerDashboard.tsx
- ✅ Updated `getNextLesson` to return null when no incomplete lessons (course complete)
- ✅ Added "Take Assessment" button when course progress is 100%
- ✅ Continue button now properly shows next lesson when course in progress

## Final Flow:
1. Learner enrolls in course → Progress starts at 0%
2. Learner completes lessons → Progress increases
3. Course completed (100%) → "Continue" button becomes "Take Assessment"
4. Click "Take Assessment" → Navigates to Course page assessment section
5. Assessment passed with 90%+ → Certificate becomes available
6. Certificate shown with View/Download options

## Key Changes in Code:

### LearnerDashboard.tsx - Continue Button Logic:
```typescript
// Before: Only showed Continue button for in-progress courses
{!isCompleted && (
  <Button onClick={handleStartLesson}>
    Continue
  </Button>
)}

// After: Shows "Take Assessment" when course is 100% complete
{enrollment.progress < 100 ? (
  <Button onClick={handleStartLesson}>
    Continue
  </Button>
) : (
  <Button onClick={() => onSelectCourse(course)}>
    Take Assessment
  </Button>
)}
```

### CourseViewer.tsx - Certificate Visibility:
```typescript
// Certificate only shown when BOTH:
// 1. Course is completed (progress >= 100)
// 2. Assessment is passed with 90%+

{assessment && assessmentPassed && assessmentPercentage >= 90 && certificate && (
  <div className="p-4 bg-yellow-500/20 ...">
    {/* Certificate UI */}
  </div>
)}

// Assessment button shown when:
// 1. Course is completed
// 2. Assessment not taken OR not passed with 90%+

{assessment && (!assessmentPassed || assessmentPercentage < 90) && (
  <div className="p-4 bg-indigo-500/20 ...">
    {/* Assessment CTA */}
  </div>
)}
```

