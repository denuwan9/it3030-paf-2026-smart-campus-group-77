import axios from 'axios';
import { supabase } from '../supabaseClient';

const API_URL = 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.access_token) {
    console.log("🔐 [API] Attaching JWT to request:", session.access_token.substring(0, 15) + "..."); 
    config.headers.Authorization = `Bearer ${session.access_token}`;
  } else {
    console.warn("⚠️ [API] No active session found.");
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add a response interceptor to handle 403 Forbidden (Domain Restrictions)
api.interceptors.response.use((response) => response, async (error) => {
  if (error.response?.status === 403) {
    console.warn("🛑 [API] 403 Forbidden: Domain or Permission error. Handling via application logic.");
  }
  return Promise.reject(error);
});

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  signup: (data) => api.post('/auth/signup', data),
  verifyOtp: (email, code) => api.post('/auth/verify-otp', { email, code }),
};

export const userService = {
  getCurrentUser: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/profile', data),
  updatePassword: (data) => api.put('/users/security/password', data),
  updatePreferences: (preferences) => api.post('/users/preferences', preferences),
};


export const adminService = {
  getAllUsers: () => api.get('/admin/users'),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export default api;
