import axios from "axios";

export async function register_resident_service(data) {
    try {
        // Convert data to FormData to handle file uploads
        const formData = new FormData();
        
        // Append all form data to FormData object
        Object.keys(data).forEach(key => {
            // Handle file input (profileImage)
            if (key === 'profileImage' && data[key] instanceof FileList) {
                if (data[key].length > 0) {
                    formData.append(key, data[key][0]);
                }
            } else if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
                // Append non-empty values
                formData.append(key, data[key]);
            } else if (data[key] === '') {
                // Send empty string for empty fields
                formData.append(key, '');
            }
        });

        // Get CSRF token from meta tag
        const token = document.head.querySelector('meta[name="csrf-token"]');
        
        const result = await axios.post("/api/register-resident", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-CSRF-TOKEN': token ? token.content : ''
            }
        });
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

export async function get_resident_details_service(id) {
    try {
        const result = await axios.get(`/api/resident-details/${id}`);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function approve_account_service(id, admin_remarks = '') {
    try {
        const result = await axios.post(`/api/approve-account/${id}`, { admin_remarks });
        return result;
    } catch (error) {
        throw error;
    }
}

export async function reject_account_service(id, admin_remarks = '') {
    try {
        const result = await axios.post(`/api/reject-account/${id}`, { admin_remarks });
        return result;
    } catch (error) {
        throw error;
    }
}

export async function set_temporary_resident_service(id, admin_remarks = '') {
    try {
        const result = await axios.post(`/api/set-temporary-resident/${id}`, { admin_remarks });
        return result;
    } catch (error) {
        throw error;
    }
}
