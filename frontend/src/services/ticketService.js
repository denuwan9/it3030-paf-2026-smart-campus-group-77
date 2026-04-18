import axiosInstance from '../api/axiosInstance';

const ticketService = {
  getAllTickets: async () => {
    const response = await axiosInstance.get('/tickets');
    return response.data;
  },

  getMyTickets: async () => {
    const response = await axiosInstance.get('/tickets/me');
    return response.data;
  },

  createTicket: async (data) => {
    const response = await axiosInstance.post('/tickets', data);
    return response.data;
  },

  updateTicketStatus: async (id, status) => {
    const response = await axiosInstance.put(`/tickets/${id}/status?status=${status}`);
    return response.data;
  }
};

export default ticketService;
