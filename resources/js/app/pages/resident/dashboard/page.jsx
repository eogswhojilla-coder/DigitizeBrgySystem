import React, { useEffect } from "react";
import Layout from "../layout";
import {
    FileText,
    Package,
    Bell,
    Shield,
    Calendar,
    CheckCircle,
    Clock,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { get_announcement_thunk } from "@/app/redux/announcement-thunk";
import { get_inventories_thunk } from "@/app/redux/inventories-thunk";
import Card from "@/app/_components/card";
import moment from "moment";

export default function Page() {
    const dispatch = useDispatch();

    const { announcements = [] } = useSelector((state) => state.announcements);
    const { inventories = [] } = useSelector((state) => state.inventories);

    useEffect(() => {
        // Initial load
        dispatch(get_announcement_thunk());
        dispatch(get_inventories_thunk());
        
        // Auto-refresh every 30 seconds for real-time updates
        const interval = setInterval(() => {
            dispatch(get_announcement_thunk());
            dispatch(get_inventories_thunk());
        }, 30000); // 30 seconds
        
        return () => clearInterval(interval);
    }, [dispatch]);

    const announcementData = announcements?.data || announcements;
    const recentAnnouncements = announcementData.slice(0, 3);

    const inventoryData = inventories?.data || inventories;
    const availableItems = inventoryData.filter(
        (item) =>
            item.status === "Active" && item.quantity > (item.borrowed || 0),
    );

    return (
        <Layout>
            <div className="space-y-6">
                {/* Welcome Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                    <h1 className="text-3xl font-bold">
                        Welcome to Resident Portal
                    </h1>
                    <p className="mt-2 text-blue-100">
                        Access barangay services and stay updated with
                        announcements.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card
                        icon={<Bell className="w-8 h-8 text-blue-600" />}
                        label="Total Announcements"
                        value={announcementData.length}
                        color="primary"
                    />
                    <Card
                        icon={<Package className="w-8 h-8 text-green-600" />}
                        label="Available Items"
                        value={availableItems.length}
                        color="success"
                    />
                    <Card
                        icon={<Clock className="w-8 h-8 text-orange-600" />}
                        label="Pending Requests"
                        value={0}
                        color="warning"
                    />
                    <Card
                        icon={
                            <CheckCircle className="w-8 h-8 text-purple-600" />
                        }
                        label="Completed"
                        value={0}
                        color="info"
                    />
                </div>

                {/* Recent Announcements */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Bell className="w-6 h-6 text-blue-600" />
                            Recent Announcements
                        </h2>
                        <a
                            href="/resident/announcements"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            View All →
                        </a>
                    </div>

                    {recentAnnouncements.length === 0 ? (
                        <div className="text-center py-12">
                            <Bell className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                                No announcements yet
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Check back later for updates from your barangay.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentAnnouncements.map((announcement) => (
                                <div
                                    key={announcement.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {announcement.name}
                                    </h3>

                                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        {moment(announcement.start_at).format(
                                            "MMM DD, YYYY",
                                        )}
                                    </div>

                                    <div
                                        className="mt-3 text-gray-700 line-clamp-2"
                                        dangerouslySetInnerHTML={{
                                            __html: announcement.description,
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Certificate */}

                    {/* Certificate */}
                    <a
                        href="/resident/certificate-request"
                        className="bg-white border-2 border-blue-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <FileText className="w-12 h-12 text-blue-600 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Request Certificate
                                </h3>
                                <p className="text-sm text-gray-600 mt-2">
                                    Request barangay certificates online
                                </p>
                            </div>

                            <span className="text-3xl font-bold text-blue-600">
                                0
                            </span>
                        </div>
                    </a>

                    {/* Borrow Items */}
                    <a
                        href="/resident/inventory-borrow"
                        className="bg-white border-2 border-green-200 rounded-xl p-6 hover:border-green-500 hover:shadow-lg transition-all"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <Package className="w-12 h-12 text-green-600 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Borrow Items
                                </h3>
                                <p className="text-sm text-gray-600 mt-2">
                                    Request to borrow barangay equipment
                                </p>
                            </div>

                            <span className="text-3xl font-bold text-green-600">
                                0
                            </span>
                        </div>
                    </a>

                    {/* Blotter */}
                    <a
                        href="/resident/blotter-notifications"
                        className="bg-white border-2 border-red-200 rounded-xl p-6 hover:border-red-500 hover:shadow-lg transition-all"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <Shield className="w-12 h-12 text-red-600 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Blotter Reports
                                </h3>
                                <p className="text-sm text-gray-600 mt-2">
                                    View your blotter notifications
                                </p>
                            </div>

                            <span className="text-3xl font-bold text-red-600">
                                0
                            </span>
                        </div>
                    </a>
                </div>
            </div>
        </Layout>
    );
}
