import axios from "axios";

export async function create_inventories_service(data) {
    try {
        // For FormData, don't set Content-Type (browser sets it with boundary)
        // CSRF token is already set globally in bootstrap.js
        const result = await axios.post("/api/inventories", data);
        return result;
    } catch (error) {
        console.error('Error creating inventory:', error);
        throw error;
    }
}

export async function get_inventories_service() {
    try {
        const result = await axios.get("/api/inventories");
        return result;
    } catch (error) {
        console.error('Error fetching inventories:', error);
        throw error;
    }
}

export async function get_inventories_by_id_service(product_code, date) {
    try {
        const res = await axios.get(
            "/api/inventories/" + product_code + "?date=" + date
        );
        return res;
    } catch (error) {
        console.error('Error fetching inventory by ID:', error);
        throw error;
    }
}

export async function delete_inventories_service(id) {
    try {
        const result = await axios.delete(`/api/inventories/${id}`);
        return result;
    } catch (error) {
        console.error('Error deleting inventory:', error);
        throw error;
    }
}

export async function update_inventories_service(id, data) {
    try {
        // For FormData, append _method for Laravel PUT
        if (data instanceof FormData) {
            data.append('_method', 'PUT');
        }
        
        // Don't set Content-Type for FormData (browser sets it with boundary)
        // CSRF token is already set globally in bootstrap.js
        const result = await axios.post(`/api/inventories/${id}`, data);
        return result;
    } catch (error) {
        console.error('Error updating inventory:', error);
        throw error;
    }
}
