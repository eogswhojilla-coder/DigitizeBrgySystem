import {
    BellIcon,
    DocumentTextIcon,
    ClipboardDocumentListIcon,
    UserPlusIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";

import React, { useState, useEffect, useRef } from "react";
import { Link } from "@inertiajs/react";
import notificationService from "@/app/services/notification-service";

const getNotificationIcon = (type) => {
    const base =
        "flex items-center justify-center rounded-xl h-10 w-10 shadow-sm";

    switch (type) {
        case "certificate_request":
            return (
                <div className={`${base} bg-purple-100`}>
                    <DocumentTextIcon className="h-5 w-5 text-purple-600" />
                </div>
            );

        case "borrow_request":
            return (
                <div className={`${base} bg-green-100`}>
                    <ClipboardDocumentListIcon className="h-5 w-5 text-green-600" />
                </div>
            );

        case "registration":
            return (
                <div className={`${base} bg-orange-100`}>
                    <UserPlusIcon className="h-5 w-5 text-orange-600" />
                </div>
            );

        default:
            return (
                <div className={`${base} bg-blue-100`}>
                    <BellIcon className="h-5 w-5 text-blue-600" />
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

    useEffect(() => {
        loadNotifications();

        const interval = setInterval(() => {
            loadNotifications();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && window.innerWidth < 640) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const loadNotifications = async () => {
        try {
            const data = await notificationService.getUnreadNotifications();

            setNotifications(data.notifications || []);
            setUnreadCount(data.unread_count || 0);
        } catch (error) {
            console.error("Failed to load notifications:", error);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            loadNotifications();
        } catch (error) {
            console.error(error);
        }
    };

    const handleMarkAllAsRead = async () => {
        if (notifications.length === 0) return;

        setLoading(true);

        try {
            await notificationService.markAllAsRead();
            loadNotifications();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();

        const diff = Math.floor((now - date) / 60000);

        if (diff < 1) return "Just now";
        if (diff < 60) return `${diff}m ago`;

        const hours = Math.floor(diff / 60);
        if (hours < 24) return `${hours}h ago`;

        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;

        return date.toLocaleDateString();
    };

    const panelContent = (
        <div className="flex flex-col h-full">

            {/* HEADER */}

            <div className="flex items-center justify-between px-5 py-4 border-b dark:border-gray-700">
                <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100">

                    Notifications

                    {unreadCount > 0 && (
                        <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </h3>

                <div className="flex items-center gap-2">

                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            disabled={loading}
                            className="text-xs font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
                        >
                            Mark all read
                        </button>
                    )}

                    <button
                        onClick={() => setIsOpen(false)}
                        className="sm:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <XMarkIcon className="h-5 w-5 text-gray-500" />
                    </button>
                </div>
            </div>

            {/* LIST */}

            <div className="flex-1 overflow-y-auto">

                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">

                        <BellIcon className="h-14 w-14 text-gray-300 dark:text-gray-600" />

                        <p className="mt-3 text-sm text-gray-500">
                            No new notifications
                        </p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className="border-b last:border-0 dark:border-gray-700"
                        >
                            <Link
                                href={notification.data?.url || "#"}
                                onClick={() => {
                                    handleMarkAsRead(notification.id);
                                    setIsOpen(false);
                                }}
                                className="flex gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition rounded-lg mx-2 my-1"
                            >

                                {getNotificationIcon(notification.data?.type)}

                                <div className="flex-1 min-w-0">

                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {notification.data?.title ||
                                            "New Notification"}
                                    </p>

                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                        {notification.data?.message ||
                                            notification.data?.description}
                                    </p>

                                    <p className="text-xs text-gray-400 mt-1">
                                        {formatDate(notification.created_at)}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    ))
                )}
            </div>

            {/* FOOTER */}

            {notifications.length > 0 && (
                <div className="border-t dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-800">

                    <button
                        onClick={handleMarkAllAsRead}
                        disabled={loading}
                        className="w-full text-center text-sm font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-50"
                    >
                        {loading ? "Clearing..." : "Clear all notifications"}
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* BELL BUTTON */}

            <div className="relative" ref={dropdownRef}>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                    <BellIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />

                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-[10px] font-semibold text-white shadow">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </button>

                {/* DESKTOP PANEL */}

                {isOpen && (
                    <div className="hidden sm:flex sm:flex-col absolute right-0 mt-3 w-[380px] max-h-[34rem] rounded-2xl bg-white dark:bg-gray-800 shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 z-50 overflow-hidden">
                        {panelContent}
                    </div>
                )}
            </div>

            {/* MOBILE BOTTOM SHEET */}

            {isOpen && (
                <div className="sm:hidden fixed inset-0 z-50 flex flex-col justify-end">

                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    <div
                        className="relative bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl flex flex-col"
                        style={{
                            maxHeight: "85dvh",
                            paddingBottom: "env(safe-area-inset-bottom)"
                        }}
                    >

                        <div className="flex justify-center pt-3 pb-1">
                            <div className="h-1 w-10 rounded-full bg-gray-300 dark:bg-gray-600" />
                        </div>

                        {panelContent}
                    </div>
                </div>
            )}
        </>
    );
}