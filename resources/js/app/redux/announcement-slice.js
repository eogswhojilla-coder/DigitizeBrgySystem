import { createSlice } from "@reduxjs/toolkit";

export const announcementSlice = createSlice({
    name: "announcement",
    initialState: {
        announcement: {},
        announcements: [],
        calendars: [],
        calendar: {},
    },
    reducers: {
        setAnnouncement: (state, action) => {
            state.announcement = action.payload;
        },
        setAnnouncements: (state, action) => {
            state.announcements = action.payload;
        },
        setCalendars: (state, action) => {
            state.calendars = action.payload;
        },
        setCalendar: (state, action) => {
            state.calendar = action.payload;
        },
    },
});
export const { setAnnouncement, setAnnouncements, setCalendars, setCalendar } = announcementSlice.actions;

export default announcementSlice.reducer;
