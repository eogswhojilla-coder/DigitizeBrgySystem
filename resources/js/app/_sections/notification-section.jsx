import { BellIcon, DocumentTextIcon, ClipboardDocumentListIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "@inertiajs/react";
import notificationService from "@/app/services/notification-service";

const getNotificationIcon = (type) => {
    switch (type) {
        case 'certificate_request':
            return (
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <DocumentTextIcon className="h-4 w-4 text-purple-600" />
                </div>
            );
        case 'borrow_request':
            return (
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <ClipboardDocumentListIcon className="h-4 w-4 text-green-600" />
                </div>
            );
        case 'registration':
            return (
                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <UserPlusIcon className="h-4 w-4 text-orange-600" />
                </div>
            );
        case 'announcement':
        default:
            return (
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <BellIcon className="h-4 w-4 text-blue-600" />
                </div>
            );
    }
};

export default function NotificationSection() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    // Load notifications on mount and set up polling
    useEffect(() => {
        loadNotifications();
        
        // Poll for new notifications every 30 seconds
        const interval = setInterval(() => {
            loadNotifications();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const loadNotifications = async () => {
        try {
            const data = await notificationService.getUnreadNotifications();
            setNotifications(data.notifications || []);
            setUnreadCount(data.unread_count || 0);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await notificationService.markAsRead(notificationId);
            // Reload notifications after marking as read
            loadNotifications();
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        if (notifications.length === 0) return;
        
        setLoading(true);
        try {
            await notificationService.markAllAsRead();
            loadNotifications();
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        
        return date.toLocaleDateString();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="relative -m-2.5 p-2.5 text-gray-400 hover:text-gray-500 focus:outline-none"
            >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 max-h-[32rem] overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b dark:border-gray-700 px-4 py-3">
                        <h3 className="text-sm font-semibold text-gray-900">
                            Notifications
                        </h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                disabled={loading}
                                className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center">
                                <BellIcon className="mx-auto h-12 w-12 text-gray-300" />
                                <p className="mt-2 text-sm text-gray-500">
                                    No new notifications
                                </p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className="border-b last:border-b-0 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <Link
                                        href={notification.data?.url || '#'}
                                        onClick={() => handleMarkAsRead(notification.id)}
                                        className="block px-4 py-3"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 mt-1">
                                                {getNotificationIcon(notification.data?.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {notification.data?.title || 'New Notification'}
                                                </p>
                                                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                                    {notification.data?.message || notification.data?.description}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-400">
                                                    {formatDate(notification.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-2">
                            <button
                                onClick={handleMarkAllAsRead}
                                disabled={loading}
                                className="block w-full text-center text-sm font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
                            >
                                {loading ? 'Clearing...' : 'Clear all notifications'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
