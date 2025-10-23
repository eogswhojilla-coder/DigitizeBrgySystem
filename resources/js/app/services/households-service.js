import axios from "axios";

// Create household
export async function create_households_service(data) {
    return await axios.post("/api/households", data);
}

// Get all households
export async function get_households_service() {
    return await axios.get("/api/households");
}

// Get household by id
export async function get_households_by_id_service(id) {
    return await axios.get(`/api/households/${id}`);
}

// Delete household
export async function delete_households_service(id) {
    return await axios.delete(`/api/households/${id}`);
}

// Update household
export async function update_households_service(data) {
    return await axios.put(`/api/households/${data.id}`, data);
}
