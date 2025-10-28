import { get_announcement_service, get_announcement_by_id_service } from "../services/accouncement-service";
import { announcementSlice } from "./announcement-slice";

export function get_announcement_thunk() {
    return async function (dispatch, getState) {
        const res = await get_announcement_service()
        dispatch(announcementSlice.actions.setAnnouncements(res.data));
    };
}

export function get_announcement_by_id_thunk(id) {
    return async function (dispatch, getState) {
        const res = await get_announcement_by_id_service(id)
        dispatch(announcementSlice.actions.setAnnouncement(res));
    };
}

// Fetch announcements for calendar (same as announcements)
export function get_announcement_calendar_thunk() {
    return async function (dispatch, getState) {
        const res = await get_announcement_service() // Use announcement service
        dispatch(announcementSlice.actions.setCalendars(res.data)); // Store in calendars
    };
}

export function get_announcement_calendar_by_id_thunk(id) {
    return async function (dispatch, getState) {
        const res = await get_announcement_by_id_service(id)
        dispatch(announcementSlice.actions.setCalendar(res));
    };
}
