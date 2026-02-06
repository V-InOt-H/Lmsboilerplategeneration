# LMS Boilerplate - Permission Errors Fix

## Task List

### 1. Fix AuthContext.tsx - Remove Duplicate Permission Definitions
- [ ] Remove local `ROLE_HIERARCHY` definition
- [ ] Remove local `ROLE_PERMISSIONS` definition
- [ ] Remove local `hasPermission` function
- [ ] Remove local `hasRoleHierarchy` function
- [ ] Import from `src/utils/permissions.ts`
- [ ] Update permission usage to match centralized format

### 2. Fix Sidebar.tsx - Remove Duplicate Constants
- [ ] Remove duplicate `PERMISSIONS` object
- [ ] Remove duplicate `ROLE_HIERARCHY` object
- [ ] Remove duplicate `ROLE_PERMISSIONS` object
- [ ] Remove duplicate `hasPermission` function
- [ ] Keep imports from centralized file

### 3. Update Use Permission Hook if Needed
- [ ] Verify `usePermission.js` imports correctly from centralized file

## Issues Identified

1. **AuthContext.tsx** has its own `ROLE_HIERARCHY` and `ROLE_PERMISSIONS` definitions instead of importing from the centralized `src/utils/permissions.ts`

2. **Sidebar.tsx** imports correctly from centralized file but also has 200+ lines of duplicate permission constants at the bottom

3. **Permission Format Mismatch** between files needs to be resolved

## Fix Status

Pending - Ready to implement

