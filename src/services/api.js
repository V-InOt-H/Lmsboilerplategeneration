// API Service for Backend Communication
const API_URL = 'http://localhost:5000/api';

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
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  
  getMe: () => apiRequest('/auth/me'),
  
  forgotPassword: (email) => apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  }),
  
  resetPassword: (token, password) => apiRequest(`/auth/reset-password/${token}`, {
    method: 'PUT',
    body: JSON.stringify({ password })
  })
};

// Users API
export const usersAPI = {
  getAll: () => apiRequest('/users'),
  getOne: (id) => apiRequest(`/users/${id}`),
  create: (userData) => apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  update: (id, userData) => apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData)
  }),
  delete: (id) => apiRequest(`/users/${id}`, { method: 'DELETE' })
};

// Courses API
export const coursesAPI = {
  getAll: (query = {}) => {
    const params = new URLSearchParams(query);
    return apiRequest(`/courses?${params}`);
  },
  getOne: (id) => apiRequest(`/courses/${id}`),
  create: (courseData) => apiRequest('/courses', {
    method: 'POST',
    body: JSON.stringify(courseData)
  }),
  update: (id, courseData) => apiRequest(`/courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(courseData)
  }),
  delete: (id) => apiRequest(`/courses/${id}`, { method: 'DELETE' }),
  enroll: (id) => apiRequest(`/courses/${id}/enroll`, { method: 'POST' }),
  updateProgress: (id, data) => apiRequest(`/courses/${id}/progress`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
};

// Assessments API
export const assessmentsAPI = {
  getAll: (query = {}) => {
    const params = new URLSearchParams(query);
    return apiRequest(`/assessments?${params}`);
  },
  getOne: (id) => apiRequest(`/assessments/${id}`),
  create: (data) => apiRequest('/assessments', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => apiRequest(`/assessments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => apiRequest(`/assessments/${id}`, { method: 'DELETE' }),
  submit: (id, answers, timeTaken) => apiRequest(`/assessments/${id}/submit`, {
    method: 'POST',
    body: JSON.stringify({ answers, timeTaken })
  }),
  getResults: (id) => apiRequest(`/assessments/${id}/results`)
};

// Knowledge Base API
export const knowledgeAPI = {
  getAll: (query = {}) => {
    const params = new URLSearchParams(query);
    return apiRequest(`/knowledge?${params}`);
  },
  getOne: (id) => apiRequest(`/knowledge/${id}`),
  create: (data) => apiRequest('/knowledge', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => apiRequest(`/knowledge/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => apiRequest(`/knowledge/${id}`, { method: 'DELETE' })
};

// Certificates API
export const certificatesAPI = {
  getAll: () => apiRequest('/certificates'),
  getOne: (id) => apiRequest(`/certificates/${id}`),
  generate: (courseId) => apiRequest('/certificates/generate', {
    method: 'POST',
    body: JSON.stringify({ courseId })
  })
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => apiRequest('/analytics/dashboard'),
  getLearner: () => apiRequest('/analytics/learner'),
  getCourse: (id) => apiRequest(`/analytics/course/${id}`),
  export: (type) => apiRequest(`/analytics/export?type=${type}`)
};

// Settings API
export const settingsAPI = {
  get: () => apiRequest('/settings'),
  update: (data) => apiRequest('/settings', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
};

// Notifications API
export const notificationsAPI = {
  getAll: () => apiRequest('/notifications'),
  markAsRead: (id) => apiRequest(`/notifications/${id}/read`, { method: 'PUT' }),
  delete: (id) => apiRequest(`/notifications/${id}`, { method: 'DELETE' })
};
