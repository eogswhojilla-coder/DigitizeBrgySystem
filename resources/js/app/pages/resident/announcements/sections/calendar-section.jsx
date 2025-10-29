import React, { useEffect } from "react";
import { Calendar } from "antd";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import ViewDaySection from "./view-day-section";
dayjs.extend(isBetween);

const CalendarSection = () => {
    const announcementsState = useSelector((state) => state.announcements);
    const calendarsData = announcementsState?.calendars?.data || announcementsState?.calendars || [];

    useEffect(() => {
        console.log("Resident Calendar - Announcements State:", announcementsState);
        console.log("Resident Calendar - Calendars Data:", calendarsData);
    }, [calendarsData, announcementsState]);

    const getListData = (value) => {
        if (!Array.isArray(calendarsData)) {
            return [];
        }

        const listData = [];
        const currentDate = value.format("YYYY-MM-DD");
        
        calendarsData.forEach((event) => {
            const announcement = event.activity || event;
            
            if (!announcement || !announcement.start_at || !announcement.end_at) {
                return;
            }

            const start = dayjs(announcement.start_at);
            const end = dayjs(announcement.end_at);
            
            if (!start.isValid() || !end.isValid()) {
                return;
            }

            const isBetweenDates = value.isBetween(start, end, "day", "[]");
            
            if (isBetweenDates) {
                listData.push({
                    type: "success",
                    content: announcement.name || "Untitled Event",
                    name: announcement.name,
                    description: announcement.description,
                    start: announcement.start_at,
                    end: announcement.end_at,
                    start_at: announcement.start_at,
                    end_at: announcement.end_at,
                    ...announcement
                });
            }
        });

        return listData;
    };

    const cell_data = (value) => {
        try {
            const listData = getListData(value);
            if (!listData?.length) return null;

            return <ViewDaySection data={listData} />;
        } catch (error) {
            console.error("Calendar cell render error:", error);
            return null;
        }
    };

    return (
        <div>
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">📅 Announcement Calendar</h2>
                        <p className="text-gray-600 mt-1">
                            {calendarsData.length === 0 
                                ? "No scheduled announcements" 
                                : `${calendarsData.length} announcement${calendarsData.length > 1 ? 's' : ''} scheduled`}
                        </p>
                    </div>
                </div>

                {calendarsData.length === 0 ? (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
                        <p className="font-semibold">⚠️ No announcements scheduled</p>
                        <p className="text-sm mt-1">Check back later for upcoming events and announcements.</p>
                    </div>
                ) : (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-4">
                        <p className="font-semibold">✅ {calendarsData.length} Announcement{calendarsData.length > 1 ? 's' : ''} Found</p>
                        <p className="text-sm mt-1">Click on highlighted dates to view announcement details.</p>
                    </div>
                )}
                
                <Calendar 
                    cellRender={(current) => cell_data(current)}
                    className="resident-calendar"
                />
            </div>
        </div>
    );
};

export default CalendarSection;