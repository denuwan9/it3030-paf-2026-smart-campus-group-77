import axiosInstance from '../api/axiosInstance';

const userService = {
  getProfile: async () => {
    return axiosInstance.get('/users/me');
  },
  
  updateProfile: async (data) => {
    return axiosInstance.put('/users/profile', data);
  },
  
  getAllUsers: async () => {
    return axiosInstance.get('/admin/users');
  }
};

export default userService;
