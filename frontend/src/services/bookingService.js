import axiosInstance from '../api/axiosInstance';

const bookingService = {
  getResources: async (params = {}) => {
    return axiosInstance.get('/resources', { params });
  },

  createBooking: async (payload) => {
    return axiosInstance.post('/bookings', payload);
  },

  updateBooking: async (bookingId, payload) => {
    return axiosInstance.put(`/bookings/${bookingId}`, payload);
  },

  cancelBooking: async (bookingId, reason) => {
    return axiosInstance.patch(`/bookings/${bookingId}/cancel`, reason ? { reason } : {});
  },

  getMyBookings: async (params = {}) => {
    return axiosInstance.get('/bookings/my', { params });
  },

  getAllBookings: async (params = {}) => {
    return axiosInstance.get('/admin/bookings', { params });
  },

  reviewBooking: async (bookingId, decision, reason) => {
    return axiosInstance.patch(`/admin/bookings/${bookingId}/decision`, { decision, reason });
  },

  getCheckInQrData: async (bookingId) => {
    return axiosInstance.get(`/bookings/${bookingId}/check-in-qr`);
  },

  lookupCheckInToken: async (token) => {
    return axiosInstance.get('/admin/bookings/check-in/lookup', { params: { token } });
  },

  verifyCheckInToken: async (token) => {
    return axiosInstance.post('/admin/bookings/check-in/verify', { token });
  },
};

export default bookingService;