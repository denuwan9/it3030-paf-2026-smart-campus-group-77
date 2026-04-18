import axios from '../api/axiosInstance';

const BASE_URL = '/tickets';

const ticketService = {
  // --- User Actions ---
  createTicket: (data) => axios.post(BASE_URL, data),
  getMyTickets: () => axios.get(`${BASE_URL}/my`),
  getTicketDetails: (id) => axios.get(`${BASE_URL}/${id}`),

  // --- Admin Actions ---
  getGlobalQueue: () => axios.get(`${BASE_URL}/admin/queue`),
  assignTechnician: (ticketId, technicianId) => 
    axios.post(`${BASE_URL}/${ticketId}/assign?technicianId=${technicianId}`),
  rejectTicket: (ticketId, reason) => 
    axios.post(`${BASE_URL}/${ticketId}/reject?reason=${reason}`),

  // --- Technician Actions ---
  getTechnicianTasks: () => axios.get(`${BASE_URL}/technician/tasks`),
  updateStatus: (ticketId, status, notes) => 
    axios.patch(`${BASE_URL}/${ticketId}/status?status=${status}${notes ? `&notes=${notes}` : ''}`),

  // --- Comment Actions ---
  getComments: (id) => axios.get(`${BASE_URL}/${id}/comments`),
  addComment: (id, content) => axios.post(`${BASE_URL}/${id}/comments`, { content }),
  deleteComment: (commentId) => axios.delete(`${BASE_URL}/comments/${commentId}`),
};

export default ticketService;
