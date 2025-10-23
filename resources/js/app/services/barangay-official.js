import axios from "axios";

export function create_barangay_officials_service(data) {
    try {
        const result = axios.post("/api/barangay_officials", data);
        return result;
    } catch (error) {}
}

export async function get_barangay_officials_service() {
    try {
        const result = axios.get("/api/barangay_officials"+window.location.search);
        return result;
    } catch (error) {}
}

export async function get_barangay_officials_by_id_service(id) {
    const res = await axios.get(
        "/api/barangay_officials/" +id
    );
    return res;
}

export async function delete_barangay_officials_service(id) {
    try {
        const result = axios.delete(`/api/barangay_officials/${id}`);
        return result;
    } catch (error) {}
}

export function update_barangay_officials_service(data) {
    try {
        const result = axios.put(`/api/barangay_officials/${data.id}`, data);
        return result;
    } catch (error) {}
}
