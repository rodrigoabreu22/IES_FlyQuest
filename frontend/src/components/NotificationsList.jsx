import React, { useEffect, useState } from 'react';
import NotificationConsumer from '../api_consumer/NotificationConsumer';
import '../css/notificationslist.css';

const NotificationList = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const fetchedNotifications = await NotificationConsumer.fetchNotificationsByUserId(userId);
                setNotifications(fetchedNotifications);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchNotifications();
    }, [userId]);

    const handleMarkAsRead = async (notificationId) => {
        try {
            await NotificationConsumer.markNotificationAsRead(notificationId);
            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === notificationId ? { ...n, beenRead: true } : n
                )
            );
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteNotification = async (notificationId) => {
        try {
            await NotificationConsumer.deleteNotification(notificationId);
            setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="notification-list-wrapper">
            <h1>Notifications</h1>
            {error && <div className="error">{error}</div>}
            {notifications.length === 0 ? (
                <div className="no-notifications-message">You have no Notifications!</div>
            ) : (
                <div className="notification-list">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`notification-item ${notification.beenRead ? 'read' : 'unread'}`}
                        >
                            <div
                                className="icon-wrapper"
                                onClick={
                                    !notification.beenRead
                                        ? () => handleMarkAsRead(notification.id)
                                        : undefined
                                }
                            >
                                {notification.beenRead ? (
                                    <i className="fas fa-envelope-open"></i>
                                ) : (
                                    <i className="fas fa-envelope"></i>
                                )}
                            </div>
                            <div className="notification-text">
                                <p className="message">{notification.message}</p>
                                <p className="date">
                                    Received: {new Date(notification.date).toLocaleString()}
                                </p>
                            </div>
                            <div className="icon-wrapper" onClick={() => handleDeleteNotification(notification.id)}>
                                <i className="fas fa-trash"></i>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationList;
