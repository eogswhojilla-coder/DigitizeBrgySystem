import React, { useEffect } from "react";
import { Calendar } from "antd";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import ViewDaySection from "./view-day-section";
dayjs.extend(isBetween);

const CalendarSection = () => {
    // Get the entire announcements state
    const announcementsState = useSelector((state) => state.announcements);
    
    // Extract data from paginated calendars object
    const calendarsData = announcementsState?.calendars?.data || announcementsState?.calendars || [];

    useEffect(() => {
        console.log("=== CALENDAR DEBUG ===");
        console.log("Announcements State:", announcementsState);
        console.log("Calendars Data:", calendarsData);
        console.log("Is Array?", Array.isArray(calendarsData));
        console.log("Length:", calendarsData?.length);
        console.log("Today's date:", dayjs().format("YYYY-MM-DD"));
        
        if (calendarsData?.length > 0) {
            calendarsData.forEach((event, index) => {
                console.log(`Event ${index}:`, event);
                const announcement = event.activity || event;
                console.log(`  - name: ${announcement?.name}`);
                console.log(`  - start_at: ${announcement?.start_at}`);
                console.log(`  - end_at: ${announcement?.end_at}`);
            });
        } else {
            console.log("❌ No calendars found in state");
        }
    }, [calendarsData, announcementsState]);

    const getListData = (value) => {
        if (!Array.isArray(calendarsData)) {
            console.log("❌ calendars is not an array:", calendarsData);
            return [];
        }

        const listData = [];
        const currentDate = value.format("YYYY-MM-DD");
        
        calendarsData.forEach((event, index) => {
            // Check if activity exists (from calendar endpoint) or use direct announcement
            const announcement = event.activity || event;
            
            if (!announcement) {
                console.log(`❌ Event ${index} has no announcement data`);
                return;
            }

            if (!announcement.start_at || !announcement.end_at) {
                console.log(`❌ Event ${index} missing dates:`, announcement);
                return;
            }

            const start = dayjs(announcement.start_at);
            const end = dayjs(announcement.end_at);
            
            if (!start.isValid() || !end.isValid()) {
                console.log(`❌ Invalid dates for ${announcement.name}:`, {
                    start_at: announcement.start_at,
                    end_at: announcement.end_at
                });
                return;
            }

            const isBetweenDates = value.isBetween(start, end, "day", "[]");
            
            if (isBetweenDates) {
                console.log(`✅ Match found for ${currentDate}:`, announcement.name);
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
            console.error("❌ Calendar cell render error:", error);
            return null;
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">📅 Announcement Calendar</h2>
            
            {calendarsData.length === 0 && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                    <p className="font-bold">⚠️ No announcements found</p>
                    <p className="text-sm">Create an announcement first to see it on the calendar.</p>
                </div>
            )}
            
            {calendarsData.length > 0 && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    <p className="font-bold">✅ Found {calendarsData.length} announcement(s)</p>
                    <p className="text-sm">Click on dates with badges to view details. Check browser console for debug info.</p>
                </div>
            )}
            
            <div className="bg-white rounded-lg shadow-lg p-4">
                <Calendar cellRender={(current) => cell_data(current)} />
            </div>
        </div>
    );
};

export default CalendarSection;
