import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      const { logout } = useAuth();
      logout();
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default {
  auth: {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (userData) => api.post('/auth/register', userData),
    getCurrentUser: () => api.get('/auth/me'),
  },
  courses: {
    getAll: () => api.get('/courses'),
    create: (courseData) => api.post('/courses', courseData),
    getById: (id) => api.get(`/courses/${id}`),
  },
  // Add other API endpoints as needed
};