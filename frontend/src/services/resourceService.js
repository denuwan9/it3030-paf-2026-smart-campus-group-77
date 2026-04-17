import axiosInstance from '../api/axiosInstance';

const resourceService = {
  getResourcesByFacilityId: async (facilityId) => {
    const response = await axiosInstance.get(`/resources/facility/${facilityId}`);
    return response.data;
  },

  getResourceById: async (id) => {
    const response = await axiosInstance.get(`/resources/${id}`);
    return response.data;
  },

  createResource: async (facilityId, data) => {
    const response = await axiosInstance.post(`/resources/facility/${facilityId}`, data);
    return response.data;
  },

  updateResource: async (id, data) => {
    const response = await axiosInstance.put(`/resources/${id}`, data);
    return response.data;
  },

  deleteResource: async (id) => {
    const response = await axiosInstance.delete(`/resources/${id}`);
    return response.data;
  }
};

export default resourceService;
