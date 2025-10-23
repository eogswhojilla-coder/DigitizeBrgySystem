import axios from "axios";

export function create_blotters_service(data) {
    try {
        const result = axios.post("/api/blotters", data);
        return result;
    } catch (error) {}
}

export async function get_blotters_service() {
    try {
        const result = axios.get("/api/blotters"+window.location.search);
        return result;
    } catch (error) {}
}

export async function get_blotters_by_id_service(id) {
    const res = await axios.get(
        "/api/blotters/" +id
    );
    return res;
}

export async function delete_blotters_service(id) {
    try {
        const result = axios.delete(`/api/blotters/${id}`);
        return result;
    } catch (error) {}
}

export function update_blotters_service(data) {
    try {
        const result = axios.put(`/api/blotters/${data.id}`, data);
        return result;
    } catch (error) {}
}
