import axiosInstance from '../api/axiosInstance';

const facilityService = {
  getAllFacilities: async () => {
    const response = await axiosInstance.get('/facilities');
    return response.data;
  },

  getFacilityById: async (id) => {
    const response = await axiosInstance.get(`/facilities/${id}`);
    return response.data;
  },

  createFacility: async (data) => {
    const response = await axiosInstance.post('/facilities', data);
    return response.data;
  },

  updateFacility: async (id, data) => {
    const response = await axiosInstance.put(`/facilities/${id}`, data);
    return response.data;
  },

  deleteFacility: async (id) => {
    const response = await axiosInstance.delete(`/facilities/${id}`);
    return response.data;
  }
};

export default facilityService;
