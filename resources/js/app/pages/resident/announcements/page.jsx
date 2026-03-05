// resources/js/app/pages/resident/announcements/page.jsx

import React, { useEffect, useState } from "react";
import Layout from "../layout";
import { Bell, Calendar as CalendarIcon, Search, List, CalendarDays } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { get_announcement_thunk, get_announcement_calendar_thunk } from "@/app/redux/announcement-thunk";
import moment from "moment";
import CalendarSection from "./sections/calendar-section";

export default function Page() {
    const dispatch = useDispatch();
    const { announcements } = useSelector((state) => state.announcements);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState("list"); // "list" or "calendar"
    
    useEffect(() => {
        // Initial load
        dispatch(get_announcement_thunk());
        dispatch(get_announcement_calendar_thunk());
        
        // Auto-refresh every 30 seconds for real-time updates
        const interval = setInterval(() => {
            dispatch(get_announcement_thunk());
            dispatch(get_announcement_calendar_thunk());
        }, 30000); // 30 seconds
        
        return () => clearInterval(interval);
    }, [dispatch]);

    const announcementData = announcements?.data || announcements || [];

    const filteredAnnouncements = announcementData.filter((announcement) =>
        announcement.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <Bell className="w-8 h-8 text-blue-600" />
                            Barangay Announcements
                        </h1>
                        <p className="text-gray-600 mt-1">Stay updated with the latest news and events</p>
                    </div>
                    
                    {/* View Mode Toggle */}
                    <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                        <button
                            onClick={() => setViewMode("list")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                                viewMode === "list"
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <List className="w-5 h-5" />
                            <span className="font-medium">List View</span>
                        </button>
                        <button
                            onClick={() => setViewMode("calendar")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                                viewMode === "calendar"
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <CalendarDays className="w-5 h-5" />
                            <span className="font-medium">Calendar View</span>
                        </button>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <Bell className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-blue-900">Real-Time Updates</h3>
                            <p className="text-sm text-blue-800 mt-1">
                                All announcements posted by barangay administrators will automatically appear here. 
                                Check regularly for important updates and events.
                            </p>
                        </div>
                    </div>
                </div>

                {viewMode === "list" ? (
                    <>
                        {/* Search */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search announcements..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Announcements List */}
                        <div className="space-y-4">
                            {filteredAnnouncements.length === 0 ? (
                                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                                    <Bell className="mx-auto h-16 w-16 text-gray-400" />
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                                        No announcements found
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-500">
                                        {searchQuery ? "Try a different search term" : "Check back later for updates"}
                                    </p>
                                </div>
                            ) : (
                                filteredAnnouncements.map((announcement) => (
                                    <div 
                                        key={announcement.id}
                                        className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border-l-4 border-blue-500"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        <Bell className="w-3 h-3 mr-1" />
                                                        Announcement
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        Posted {moment(announcement.created_at).fromNow()}
                                                    </span>
                                                </div>
                                                <h2 className="text-2xl font-bold text-gray-900">
                                                    {announcement.name}
                                                </h2>
                                                <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                                                        <CalendarIcon className="w-4 h-4 text-green-600" />
                                                        <span className="font-medium text-green-700">
                                                            Start: {moment(announcement.start_at).format("MMM DD, YYYY hh:mm A")}
                                                        </span>
                                                    </span>
                                                    <span className="flex items-center gap-1 bg-red-50 px-3 py-1 rounded-full">
                                                        <CalendarIcon className="w-4 h-4 text-red-600" />
                                                        <span className="font-medium text-red-700">
                                                            End: {moment(announcement.end_at).format("MMM DD, YYYY hh:mm A")}
                                                        </span>
                                                    </span>
                                                </div>
                                                <div 
                                                    className="mt-4 text-gray-700 prose max-w-none"
                                                    dangerouslySetInnerHTML={{ __html: announcement.description }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                ) : (
                    /* Calendar View */
                    <CalendarSection />
                )}
            </div>
        </Layout>
    );
}