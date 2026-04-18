import axiosInstance from '../api/axiosInstance';

const dashboardService = {
  getUserStats: async () => {
    const response = await axiosInstance.get('/dashboard/user-stats');
    return response.data;
  },

  getAdminStats: async () => {
    const response = await axiosInstance.get('/dashboard/admin-stats');
    return response.data;
  },

  getRecentActivity: async () => {
    const response = await axiosInstance.get('/dashboard/recent-activity');
    return response.data;
  },
  
  getTechnicianStats: async () => {
    const response = await axiosInstance.get('/dashboard/technician-stats');
    return response.data;
  }
};

export default dashboardService;
