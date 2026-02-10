// Enrollment Management API Service
// Handles all enrollment-related API calls to the backend

const API_URL = getApiUrl();

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    }
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Permission denied. You may not have access to this resource.');
      }
      if (response.status === 401) {
        throw new Error('Unauthorized. Please log in again.');
      }
      throw new Error(data.message || `API request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error('🚫 CORS or Network Error:', error);
      throw new Error('Failed to connect to server. Please check your internet connection.');
    }
    
    console.error('API Error:', error);
    throw error;
  }
};

// Enrollment API methods
export const enrollmentsAPI = {
  // Get all enrollments with optional filters
  getAll: (query = {}) => {
    const params = new URLSearchParams(query);
    return apiRequest(`/enrollments?${params}`);
  },

  // Get enrollment statistics
  getStats: () => apiRequest('/enrollments/stats'),

  // Get enrollments for a specific user
  getUserEnrollments: (userId) => apiRequest(`/enrollments/user/${userId}`),

  // Get enrollments for a specific course
  getCourseEnrollments: (courseId, query = {}) => {
    const params = new URLSearchParams(query);
    return apiRequest(`/enrollments/course/${courseId}?${params}`);
  },

  // Bulk enroll users in courses
  bulkEnroll: (data) => apiRequest('/enrollments/bulk', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Enroll a single user
  enroll: (data) => apiRequest('/enrollments', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Update enrollment progress/status
  update: (userId, courseId, data) => apiRequest(`/enrollments/${userId}/${courseId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  // Remove an enrollment
  remove: (userId, courseId) => apiRequest(`/enrollments/${userId}/${courseId}`, {
    method: 'DELETE'
  })
};

// Helper to get API URL (same as in api.js)
function getApiUrl() {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  const { protocol, hostname } = window.location;
  const backendPort = hostname === 'localhost' ? 5000 : 5000;
  return `${protocol}//${hostname}:${backendPort}/api`;
}

export default enrollmentsAPI;

