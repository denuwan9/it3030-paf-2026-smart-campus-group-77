import axios from 'axios';
import toast from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Injection interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'An unexpected error occurred';
    
    if (status === 401) {
      // Unauthorized: Clear session and redirect to login
      if (localStorage.getItem('token')) {
        toast.error('Session expired. Please log in again.', { id: 'session-expired' });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Use window.location.href for a clean reset of context
        window.location.href = '/login';
      }
    } else if (status === 403) {
      // Forbidden: Show localized error
      toast.error('Access Denied: You do not have permission to perform this action.', { id: 'access-denied' });
    } else if (status >= 500) {
      // Server Error
      toast.error('Server is currently unavailable. Please try again later.');
    }
    
    // We reject so the calling component can still handle specific 400 errors
    return Promise.reject(error);
  }
);

export default axiosInstance;
