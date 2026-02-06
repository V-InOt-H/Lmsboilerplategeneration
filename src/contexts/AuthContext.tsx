import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

// Role hierarchy levels
const ROLE_HIERARCHY = {
  'Super Admin': 5,
  'Admin': 4,
  'HR': 3,
  'Trainer': 2,
  'Learner': 1
};

// Permission definitions for each role
const ROLE_PERMISSIONS = {
  'Super Admin': [
    'system:super_admin', 'system:full_access',
    'users:read', 'users:create', 'users:update', 'users:delete', 'users:deactivate',
    'courses:read', 'courses:create', 'courses:update', 'courses:delete', 'courses:publish',
    'assessments:read', 'assessments:create', 'assessments:update', 'assessments:delete',
    'assessments:grade', 'assessments:view-results',
    'analytics:read', 'analytics:export',
    'settings:read', 'settings:update',
    'knowledge:read', 'knowledge:create', 'knowledge:update', 'knowledge:delete',
    'certificates:read', 'certificates:create'
  ],
  'Admin': [
    'users:read', 'users:create', 'users:update', 'users:deactivate',
    'courses:read', 'courses:create', 'courses:update', 'courses:delete', 'courses:publish',
    'assessments:read', 'assessments:create', 'assessments:update', 'assessments:delete',
    'assessments:grade', 'assessments:view-results',
    'analytics:read', 'analytics:export',
    'settings:read',
    'knowledge:read', 'knowledge:create', 'knowledge:update', 'knowledge:delete',
    'certificates:read', 'certificates:create'
  ],
  'HR': [
    'users:read', 'users:create', 'users:update',
    'courses:read',
    'assessments:read', 'assessments:view-results',
    'analytics:read',
    'knowledge:read',
    'certificates:read'
  ],
  'Trainer': [
    'courses:read', 'courses:create', 'courses:update', 'courses:publish',
    'assessments:read', 'assessments:create', 'assessments:update',
    'assessments:grade', 'assessments:view-results',
    'analytics:read',
    'knowledge:read', 'knowledge:create', 'knowledge:update',
    'certificates:read', 'certificates:create'
  ],
  'Learner': [
    'courses:read',
    'assessments:read', 'assessments:view-results',
    'knowledge:read',
    'certificates:read'
  ]
};

// Permission checking helper
const hasPermission = (role, permission) => {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  if (role === 'Super Admin') return true;
  return permissions.includes(permission);
};

// Role hierarchy check
const hasRoleHierarchy = (role1, role2) => {
  const level1 = ROLE_HIERARCHY[role1] || 0;
  const level2 = ROLE_HIERARCHY[role2] || 0;
  return level1 >= level2;
};

const AuthContext = createContext({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  hasRole: (...roles: string[]) => false,
  hasPermission: () => false,
  hasAnyPermission: () => false,
  hasMinimumRole: () => false,
  getRoleInfo: () => null,
  permissions: [],
  isAuthenticated: false,
  role: null
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [permissions, setPermissions] = useState([]);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuthWithTimeout = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Add timeout to prevent hanging
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Auth check timeout')), 5000)
          );
          
          const authPromise = authAPI.getMe();
          const response = await Promise.race([authPromise, timeoutPromise]);
          
          setUser(response.user);
          // Set permissions based on role
          setPermissions(ROLE_PERMISSIONS[response.user.role] || []);
        } catch (err) {
          console.error('Auth check failed:', err);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuthWithTimeout();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await authAPI.getMe();
        setUser(response.user);
        // Set permissions based on role
        setPermissions(ROLE_PERMISSIONS[response.user.role] || []);
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login({ email, password });
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setPermissions(ROLE_PERMISSIONS[response.user.role] || []);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.register(userData);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setPermissions(ROLE_PERMISSIONS[response.user.role] || []);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setPermissions([]);
  };

  const hasRole = (...roles) => {
    return user && roles.includes(user.role);
  };

  // Check if user has a specific permission
  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'Super Admin') return true;
    return permissions.includes(permission);
  };

  // Check if user has any of the specified permissions
  const hasAnyPermission = (...permissionList) => {
    if (!user) return false;
    if (user.role === 'Super Admin') return true;
    return permissionList.some(p => permissions.includes(p));
  };

  // Check if user has at least the minimum role
  const hasMinimumRole = (minimumRole) => {
    if (!user) return false;
    return hasRoleHierarchy(user.role, minimumRole);
  };

  // Get role info for display
  const getRoleInfo = () => {
    if (!user) return null;
    const roleInfo = {
      'Super Admin': { label: 'Super Admin', color: 'bg-red-500/20 text-red-300', icon: '👑' },
      'Admin': { label: 'Admin', color: 'bg-purple-500/20 text-purple-300', icon: '⚡' },
      'HR': { label: 'HR', color: 'bg-orange-500/20 text-orange-300', icon: '👥' },
      'Trainer': { label: 'Trainer', color: 'bg-blue-500/20 text-blue-300', icon: '📚' },
      'Learner': { label: 'Learner', color: 'bg-green-500/20 text-green-300', icon: '🎓' }
    };
    return roleInfo[user.role] || { label: user.role, color: 'bg-gray-500/20 text-gray-300', icon: '' };
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasMinimumRole,
    getRoleInfo,
    permissions,
    isAuthenticated: !!user,
    role: user?.role || null
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

