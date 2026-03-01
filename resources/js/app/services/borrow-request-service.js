import axios from "axios";

export function get_borrow_requests_service(status = '') {
    try {
        const queryParams = status ? `?status=${status}` : '';
        const result = axios.get(`/api/admin/borrow-requests${queryParams}`);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function approve_borrow_request_service(id, remarks = '') {
    try {
        const result = await axios.patch(`/api/admin/borrow-requests/${id}/approve`, { remarks });
        return result;
    } catch (error) {
        throw error;
    }
}

export async function decline_borrow_request_service(id, remarks) {
    try {
        const result = await axios.patch(`/api/admin/borrow-requests/${id}/decline`, { remarks });
        return result;
    } catch (error) {
        throw error;
    }
}

export async function mark_as_returned_service(id, condition_after_return, remarks = '') {
    try {
        const result = await axios.patch(`/api/admin/borrow-requests/${id}/return`, { 
            condition_after_return,
            remarks 
        });
        return result;
    } catch (error) {
        throw error;
    }
}
