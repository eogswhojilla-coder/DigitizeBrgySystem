import axios from "axios";

export function create_inventories_service(data) {
    try {
        const result = axios.post("/api/inventories", data);
        return result;
    } catch (error) {}
}

export function get_inventories_service() {
    try {
        const result = axios.get("/api/inventories");
        return result;
    } catch (error) {}
}

export async function get_inventories_by_id_service(product_code, date) {
    const res = await axios.get(
        "/api/inventories/" + product_code + "?date=" + date
    );
    return res;
}

export async function delete_inventories_service(id) {
    try {
        const result = await axios.delete(`/api/inventories/${id}`);
        return result;
    } catch (error) {}
}

export async function update_inventories_service(data) {
    try {
        const result =await axios.put(`/api/inventories/${data.id}`, data);
        return result;
    } catch (error) {}
}
