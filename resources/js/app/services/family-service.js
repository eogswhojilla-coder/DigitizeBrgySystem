import axios from "axios";

export function get_families_service() {
    return axios.get("/api/families" + window.location.search);
}

export function get_family_by_id_service(id) {
    return axios.get(`/api/families/${id}`);
}

export function create_family_service(data) {
    return axios.post("/api/families", data);
}

export function update_family_service(id, data) {
    return axios.put(`/api/families/${id}`, data);
}

export function delete_family_service(id) {
    return axios.delete(`/api/families/${id}`);
}