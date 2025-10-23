import axios from "axios";

export function create_families_service(data) {
    try {
        const result = axios.post("/api/families", data);
        return result;
    } catch (error) {}
}

export function get_families_service() {
    try {
        const result = axios.get("/api/families");
        return result;
    } catch (error) {}
}

export async function get_families_by_id_service(product_code, date) {
    const res = await axios.get(
        "/api/families/" + product_code + "?date=" + date
    );
    return res;
}

export function delete_families_service(id) {
    try {
        const result = axios.delete(`/api/families/${id}`); 
        return result;
    } catch (error) {}
}

export function update_families_service(data) {
    try {
        const result = axios.put(`/api/families/${data.id}`, data);
        return result;
    } catch (error) {}
}
