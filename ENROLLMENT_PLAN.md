# Enrollment Management System - Implementation Plan

## Overview
Create a new enrollment management page accessible by Super Admin, Admin, and Trainer to manage course enrollments with bulk enrollment capability.

## Current State Analysis
- **User.model.js**: Already has `enrolledCourses` array with:
  - `course` (ObjectId ref to Course)
  - `enrolledAt` (Date)
  - `progress` (Number)
  - `completedLessons` (Array of ObjectId)
  - `status` ('In Progress' | 'Completed')
- **Course.model.js**: Has `enrolledUsers` array
- **Existing Controllers**: `enrollCourse` and `updateProgress` exist in course.controller.js
- **Permissions**: Role-based permissions are in place

## Required Implementation

### 1. Backend Changes

#### A. New Enrollment Model (Optional - using existing schema)
We can use the existing User model's enrolledCourses array, but for better querying we may create an Enrollment model for centralized enrollment management.

#### B. New Enrollment Controller (`backend/controllers/enrollment.controller.js`)
Required functions:
- `getAllEnrollments` - Get all enrollments with filtering/pagination
- `bulkEnrollUsers` - Enroll multiple users in one or multiple courses
- `getEnrollmentById` - Get single enrollment details
- `updateEnrollment` - Update enrollment status/progress
- `removeEnrollment` - Remove an enrollment

#### C. New Enrollment Routes (`backend/routes/enrollment.routes.js`)
API endpoints:
- `GET /api/enrollments` - List all enrollments
- `POST /api/enrollments/bulk` - Bulk enroll users
- `GET /api/enrollments/:id` - Get enrollment details
- `PUT /api/enrollments/:id` - Update enrollment
- `DELETE /api/enrollments/:id` - Remove enrollment

#### D. Update Server (`backend/server.js`)
Add the new enrollment routes.

### 2. Frontend Changes

#### A. New Enrollment API Service (`src/services/enrollmentsAPI.js`)
Add enrollment-related API calls.

#### B. New Enrollment Management Page (`src/app/components/enrollments/EnrollmentManagement.tsx`)
Features:
- Table displaying all enrollments with columns:
  - Learner Name
  - Learner Email
  - Course Name
  - Enrolled Date
  - Progress (with progress bar)
  - Status (In Progress/Completed)
- Search and filter functionality
- Bulk Enroll button opens modal

#### C. Bulk Enroll Modal Component
Modal with:
- Course selector (multi-select)
- User/Learner selector (multi-select)
- CSV import option (optional)
- Confirm button

#### D. Update App.tsx
Add new route/component for enrollments.

#### E. Update Sidebar.tsx
Add "Enrollments" menu item for Super Admin, Admin, Trainer.

## Implementation Steps

### Step 1: Backend Controller & Routes
1. Create `backend/controllers/enrollment.controller.js`
2. Create `backend/routes/enrollment.routes.js`
3. Update `backend/server.js` to include new routes

### Step 2: Frontend API Service
4. Create `src/services/enrollmentsAPI.js`

### Step 3: Frontend Components
5. Create `src/app/components/enrollments/EnrollmentManagement.tsx`
6. Create `src/app/components/enrollments/BulkEnrollDialog.tsx`
7. Update `src/app/App.tsx` with new view
8. Update `src/app/components/layout/Sidebar.tsx` with menu item

### Step 4: Permissions
9. Add enrollment-related permissions to `src/utils/permissions.ts`

## Files to Create/Modify

### New Files:
1. `backend/controllers/enrollment.controller.js`
2. `backend/routes/enrollment.routes.js`
3. `src/services/enrollmentsAPI.js`
4. `src/app/components/enrollments/EnrollmentManagement.tsx`
5. `src/app/components/enrollments/BulkEnrollDialog.tsx`

### Modified Files:
1. `backend/server.js` - Add enrollment routes
2. `src/app/App.tsx` - Add enrollments view
3. `src/app/components/layout/Sidebar.tsx` - Add menu item

## Estimated Time
- Backend: 1-2 hours
- Frontend: 2-3 hours
- Testing/Integration: 1 hour
- **Total: 4-6 hours**

