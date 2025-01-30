import URL_CONFIG from "../config";

const API_BASE_URL = URL_CONFIG.API_URL + '/notification';

const NotificationConsumer = {
    // Fetch all notifications for a specific user by user ID
    fetchNotificationsByUserId: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/all/${userId}`);
        if (!response.ok) {
            throw new Error(`Error fetching notifications for user ID: ${userId}`);
        }
        return await response.json();
    },

    // Mark a specific notification as read by notification ID
    markNotificationAsRead: async (notificationId) => {
        const response = await fetch(`${API_BASE_URL}/${notificationId}`, {
            method: 'PUT',
        });
        if (!response.ok) {
            throw new Error(`Error marking notification ID: ${notificationId} as read`);
        }
        return await response.json();
    },

    // Delete a specific notification by notification ID
    deleteNotification: async (notificationId) => {
        const response = await fetch(`${API_BASE_URL}/${notificationId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Error deleting notification ID: ${notificationId}`);
        }
    },
};

export default NotificationConsumer;
