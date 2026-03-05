import axios from 'axios';

/**
 * Notification service for managing user notifications
 */
const notificationService = {
    /**
     * Get all notifications for the current user (paginated)
     */
    getAllNotifications: async (page = 1) => {
        try {
            const response = await axios.get(`/api/notifications?page=${page}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    },

    /**
     * Get only unread notifications
     */
    getUnreadNotifications: async () => {
        try {
            const response = await axios.get('/api/notifications/unread');
            return response.data;
        } catch (error) {
            console.error('Error fetching unread notifications:', error);
            throw error;
        }
    },

    /**
     * Mark a specific notification as read
     * @param {string} notificationId - The UUID of the notification
     */
    markAsRead: async (notificationId) => {
        try {
            const response = await axios.post(`/api/notifications/${notificationId}/read`);
            return response.data;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    },

    /**
     * Mark all notifications as read
     */
    markAllAsRead: async () => {
        try {
            const response = await axios.post('/api/notifications/mark-all-read');
            return response.data;
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    },

    /**
     * Delete a specific notification
     * @param {string} notificationId - The UUID of the notification
     */
    deleteNotification: async (notificationId) => {
        try {
            const response = await axios.delete(`/api/notifications/${notificationId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting notification:', error);
            throw error;
        }
    },
};

export default notificationService;
