import axiosInstance from '../api/axiosInstance';

/**
 * All API calls for the Notifications module.
 * Uses the shared axiosInstance which attaches the JWT automatically.
 */
const notificationService = {

  /** Fetch all notifications for the current user (newest first, max 50). */
  getNotifications: () =>
    axiosInstance.get('/notifications').then(r => r.data),

  /** Fetch just the unread badge count. */
  getUnreadCount: () =>
    axiosInstance.get('/notifications/unread-count').then(r => r.data),

  /** Mark a specific notification as read. */
  markAsRead: (id) =>
    axiosInstance.patch(`/notifications/${id}/read`).then(r => r.data),

  /** Mark all notifications as read. */
  markAllAsRead: () =>
    axiosInstance.patch('/notifications/read-all').then(r => r.data),

  /** Delete a notification permanently. */
  deleteNotification: (id) =>
    axiosInstance.delete(`/notifications/${id}`).then(r => r.data),

  /** Get the current user's notification preferences. */
  getSettings: () =>
    axiosInstance.get('/notifications/settings').then(r => r.data),

  /** Update notification preferences. */
  updateSettings: (dto) =>
    axiosInstance.put('/notifications/settings', dto).then(r => r.data),

  /**
   * Admin-only: broadcast a SYSTEM notification to all active users.
   * @param {string} title
   * @param {string} message
   */
  broadcast: (title, message) =>
    axiosInstance.post('/notifications/broadcast', { title, message }).then(r => r.data),
};

export default notificationService;
