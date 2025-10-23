import axios from "axios";

export function create_family_members_service(data) {
    try {
        const result = axios.post("/api/family_members", data);
        return result;
    } catch (error) {}
}

export function get_family_members_service() {
    try {
        const result = axios.get("/ap");
        return result;
    } catch (error) {}
}

export async function get_family_members_by_id_service(product_code, date) {
    const res = await axios.get(
        "/ap/" + product_code + "?date=" + date
    );
    return res;
}

export function delete_family_members_service(id) {
    try {
        const result = axios.delete(`/ap/${id}`);
        return result;
    } catch (error) {}
}

export function update_family_members_service(data) {
    try {
        const result = axios.put(`/ap/${data.id}`, data);
        return result;
    } catch (error) {}
}
