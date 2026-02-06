# CourseViewer.tsx Fixes

## Issues Identified:
1. Type mismatch - User interface doesn't include enrolledCourses
2. hasRole function signature mismatch - passing array instead of spread args
3. Potential null reference issues

## Fixes Applied:
- [x] 1. Fix hasRole call from array to spread args: `hasRole('Super Admin', 'Admin', 'Trainer')`
- [x] 2. Add proper type for User with enrolledCourses
- [x] 3. Add proper null checks for course references
- [x] 4. Fix the User type casting in useAuth

## Changes Made:
1. Line ~52: Changed `hasRole(['Super Admin', 'Admin', 'Trainer'])` to `hasRole('Super Admin', 'Admin', 'Trainer')`
2. Added proper type handling for user with enrolledCourses
3. Added null safety checks for course references

