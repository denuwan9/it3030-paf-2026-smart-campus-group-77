import axiosInstance from '../api/axiosInstance';

const userService = {
  getProfile: async () => {
    return axiosInstance.get('/user/me');
  },
  
  updateProfile: async (data) => {
    return axiosInstance.put('/user/profile', data);
  },
  
  changePassword: async (data) => {
    return axiosInstance.put('/user/change-password', data);
  },
  
  getAllUsers: async () => {
    return axiosInstance.get('/admin/users');
  },
  
  adminUpdateUser: async (id, data) => {
    return axiosInstance.put(`/admin/users/${id}`, data);
  },
  
  adminDeleteUser: async (id) => {
    return axiosInstance.delete(`/admin/users/${id}`);
  }
};


export default userService;
