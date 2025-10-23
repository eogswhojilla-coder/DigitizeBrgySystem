import axios from "axios";

export function create_positions_service(data) {
    try {
        const result = axios.post("/api/positions", data);
        return result;
    } catch (error) {}
}

export async function get_positions_service() {
    try {
        const result = axios.get("/api/positions"+window.location.search);
        return result;
    } catch (error) {}
}

export async function get_positions_by_id_service(id) {
    const res = await axios.get(
        "/api/positions/" +id
    );
    return res;
}

export async function delete_positions_service(id) {
    try {
        const result = axios.delete(`/api/positions/${id}`);
        return result;
    } catch (error) {}
}

export function update_positions_service(data) {
    try {
        const result = axios.put(`/api/positions/${data.id}`, data);
        return result;
    } catch (error) {}
}
