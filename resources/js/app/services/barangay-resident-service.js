import axios from "axios";

export function create_barangay_residents_service(data) {
    try {
        const result = axios.post("/api/barangay_residents", data);
        return result;
    } catch (error) {}
}

export async function get_barangay_residents_service() {
    try {
        const result = axios.get("/api/barangay_residents"+window.location.search);
        return result;
    } catch (error) {}
}

export async function get_barangay_residents_by_id_service(id) {
    const res = await axios.get(
        "/api/barangay_residents/" +id
    );
    return res;
}

export async function delete_barangay_residents_service(id) {
    try {
        const result = axios.delete(`/api/barangay_residents/${id}`);
        return result;
    } catch (error) {}
}

export function update_barangay_residents_service(data) {
    try {
        const result = axios.put(`/api/barangay_residents/${data.id}`, data);
        return result;
    } catch (error) {}
}
