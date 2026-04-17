import axiosInstance from '../api/axiosInstance';

const adminService = {
  getUserSummary: async () => {
    return axiosInstance.get('/admin/users/summary');
  },

  createAnnouncement: async (announcementData) => {
    return axiosInstance.post('/admin/announcements', announcementData);
  }
};

export default adminService;
