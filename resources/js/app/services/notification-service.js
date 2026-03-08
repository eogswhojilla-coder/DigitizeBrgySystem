import axios from 'axios';

/**
 * Get the notification API base path depending on whether user is admin or resident
 */
const getBasePath = () => {
    const isAdmin = window.location.pathname.startsWith('/administrator');
    return isAdmin ? '/api/admin/notifications' : '/api/notifications';
};

/**
 * Notification service for managing user notifications
 */
const notificationService = {
    /**
     * Get all notifications for the current user (paginated)
     */
    getAllNotifications: async (page = 1) => {
        try {
            const response = await axios.get(`${getBasePath()}?page=${page}`);
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
            const response = await axios.get(`${getBasePath()}/unread`);
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
            const response = await axios.post(`${getBasePath()}/${notificationId}/read`);
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
            const response = await axios.post(`${getBasePath()}/mark-all-read`);
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
            const response = await axios.delete(`${getBasePath()}/${notificationId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting notification:', error);
            throw error;
        }
    },
};

export default notificationService;
