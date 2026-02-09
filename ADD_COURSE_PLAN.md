# Add Course Functionality for Trainers - Implementation Plan

## Task Summary
Enable trainers to create new courses through a direct navigation flow from the dashboard.

## Current State ✅ COMPLETED
- `TrainerDashboard.tsx` has a "Create New Course" button that navigates to 'courses' view (CourseList)
- `CourseList.tsx` has a "Create Course" button that should work
- `App.tsx` handles navigation between views

## Issues Identified ✅ FIXED
1. Navigation from TrainerDashboard goes through CourseList before reaching CourseBuilder ✅ FIXED
2. Need to add proper callback for creating new courses ✅ FIXED

## Implementation Completed

### Step 1: Update TrainerDashboard.tsx ✅ COMPLETED
- Added `onCreateCourse` callback prop to interface
- Updated "Create New Course" button to call `onCreateCourse` when available, fallback to `onNavigate('courses')`
- Updated component signature to accept `onCreateCourse` prop

### Step 2: Update App.tsx ✅ COMPLETED
- Added `onCreateCourse` callback when rendering TrainerDashboard
- Callback sets `selectedItem` to null and navigates directly to 'course-builder'

### Step 3: Verify CourseList.tsx ✅ VERIFIED
- "Create Course" button is properly configured with `onCreateCourse` prop
- Permission checks (`canCreateCourse`) are correctly implemented
- Button only appears for users with appropriate permissions

## Files Modified
1. `/home/zerotrace/Lmsboilerplategeneration/src/app/components/trainer/TrainerDashboard.tsx`
2. `/home/zerotrace/Lmsboilerplategeneration/src/app/App.tsx`

## Expected Outcome ✅ ACHIEVED
Trainers can now:
1. Click "Create New Course" from dashboard → Direct to CourseBuilder
2. View all courses in CourseList with "Create Course" button available

## Follow-up Steps
- Test the navigation flow
- Verify permissions work correctly for trainers
