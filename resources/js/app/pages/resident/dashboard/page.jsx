import React, { useEffect, useState } from "react";
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
import Card from "@/app/_components/card";
import moment from "moment";
import axios from "axios";

export default function Page() {
    const dispatch = useDispatch();

    const { announcements = [] } = useSelector((state) => state.announcements);
    const [availableItems, setAvailableItems] = useState([]);
    const [borrowRequests, setBorrowRequests] = useState([]);
    const [certificateRequests, setCertificateRequests] = useState([]);

    const fetchResidentData = async () => {
        try {
            const [inventoryRes, borrowRes, certRes] = await Promise.all([
                axios.get('/api/inventories/available'),
                axios.get('/api/my-borrow-requests'),
                axios.get('/api/my-certificate-requests'),
            ]);
            const items = inventoryRes.data.data || inventoryRes.data || [];
            setAvailableItems(Array.isArray(items) ? items : []);
            setBorrowRequests(borrowRes.data.data || []);
            setCertificateRequests(certRes.data.data || []);
        } catch (error) {
            console.error('Error fetching resident data:', error);
        }
    };

    useEffect(() => {
        // Initial load
        dispatch(get_announcement_thunk());
        fetchResidentData();
        
        // Auto-refresh every 30 seconds for real-time updates
        const interval = setInterval(() => {
            dispatch(get_announcement_thunk());
            fetchResidentData();
        }, 30000); // 30 seconds
        
        return () => clearInterval(interval);
    }, [dispatch]);

    const announcementData = announcements?.data || announcements;
    const recentAnnouncements = announcementData.slice(0, 3);

    // Compute real counts
    const pendingBorrow = borrowRequests.filter(r => r.status === 'pending').length;
    const pendingCert = certificateRequests.filter(r => r.status === 'pending_verification' || r.status === 'verified' || r.status === 'for_release').length;
    const totalPending = pendingBorrow + pendingCert;

    const completedBorrow = borrowRequests.filter(r => r.status === 'returned').length;
    const completedCert = certificateRequests.filter(r => r.status === 'released').length;
    const totalCompleted = completedBorrow + completedCert;

    return (
        <Layout>
            <div className="space-y-4 sm:space-y-6">
                {/* Welcome Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 sm:p-6 text-white">
                    <h1 className="text-xl sm:text-3xl font-bold">
                        Welcome to Resident Portal
                    </h1>
                    <p className="mt-1 sm:mt-2 text-sm sm:text-base text-blue-100">
                        Access barangay services and stay updated with
                        announcements.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
                        value={totalPending}
                        color="warning"
                    />
                    <Card
                        icon={
                            <CheckCircle className="w-8 h-8 text-purple-600" />
                        }
                        label="Completed"
                        value={totalCompleted}
                        color="info"
                    />
                </div>

                {/* Recent Announcements */}
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
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
                                {certificateRequests.length}
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
                                {borrowRequests.length}
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
                                
                            </span>
                        </div>
                    </a>
                </div>
            </div>
        </Layout>
    );
}
