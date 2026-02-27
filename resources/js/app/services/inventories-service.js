import axios from "axios";

export function create_inventories_service(data) {
    try {
        const config = data instanceof FormData ? {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        } : {};
        const result = axios.post("/api/inventories", data, config);
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

export async function update_inventories_service(id, data) {
    try {
        const config = data instanceof FormData ? {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        } : {};
        
        // For FormData, append _method for Laravel PUT
        if (data instanceof FormData) {
            data.append('_method', 'PUT');
        }
        
        const result = await axios.post(`/api/inventories/${id}`, data, config);
        return result;
    } catch (error) {
        throw error;
    }
}
