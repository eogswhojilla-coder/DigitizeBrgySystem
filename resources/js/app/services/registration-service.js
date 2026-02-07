import axios from "axios";

export async function register_resident_service(data) {
    try {
        const result = await axios.post("/api/register-resident", data);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function get_pending_accounts_service() {
    try {
        const result = await axios.get("/api/pending-accounts" + window.location.search);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function approve_account_service(id) {
    try {
        const result = await axios.post(`/api/approve-account/${id}`);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function reject_account_service(id) {
    try {
        const result = await axios.post(`/api/reject-account/${id}`);
        return result;
    } catch (error) {
        throw error;
    }
}
