import axios from "axios";

export function create_announcement_service(data) {
    try {
        const result = axios.post("/api/announcement", data);
        return result;
    } catch (error) {
        throw error;
    }
}

export function get_announcement_service() {
    try {
        const result = axios.get("/api/announcement");
        return result;
    } catch (error) {
        throw error;
    }
}

export async function get_announcement_by_id_service(id) {
    const res = await axios.get("/api/announcement/" + id);
    return res;
}

export function delete_announcement_service(id) {
    try {
        const result = axios.delete(`/api/announcement/${id}`);
        return result;
    } catch (error) {
        throw error;
    }
}

export function update_announcement_service(data) {
    try {
        const result = axios.post(`/api/announcement/${data.get('id')}`, data);
        return result;
    } catch (error) {
        throw error;
    }
}
