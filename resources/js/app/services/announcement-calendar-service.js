import axios from "axios";

export async function get_announcement_calendar_service() {
    try {
        const result = await axios.get("/api/announcement_calendar"); // Changed from announcement-calendar
        return result;
    } catch (error) {
        console.error("Error fetching calendars:", error);
        throw error;
    }
}

export async function get_announcement_calendar_by_id_service(id) {
    try {
        const res = await axios.get(`/api/announcement_calendar/${id}`);
        return res;
    } catch (error) {
        console.error("Error fetching calendar by id:", error);
        throw error;
    }
}

export function create_announcement_calendar_service(data) {
    try {
        const result = axios.post("/api/announcement-calendar", data);
        return result;
    } catch (error) {
        console.error("Error creating calendar:", error);
        throw error;
    }
}

export function update_announcement_calendar_service(data) {
    try {
        const result = axios.put(`/api/announcement-calendar/${data.id}`, data);
        return result;
    } catch (error) {
        console.error("Error updating calendar:", error);
        throw error;
    }
}

export function delete_announcement_calendar_service(id) {
    try {
        const result = axios.delete(`/api/announcement-calendar/${id}`);
        return result;
    } catch (error) {
        console.error("Error deleting calendar:", error);
        throw error;
    }
}
