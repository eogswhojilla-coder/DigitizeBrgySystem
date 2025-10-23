import axios from "axios"

export function get_account_by_department_service(data) {
    try {
        const result = axios.get('/api/get_account_by_department?'+ new URLSearchParams(data).toString())
        return result
    } catch (error) {

    }
}

export function create_accounts_service(data) {
    try {
        const result = axios.post('/api/accounts', data)
        return result
    } catch (error) {

    }
}



export function get_accounts_service() {
    try {
        const queryString = window.location.search;
        const hasQuery = queryString.includes("?");
        const separator = hasQuery ? "&" : "?";
        const ticketing_location = window.location.pathname.split('/')[3] == "carcar"?"Carcar":"San Carlos";

        const result = axios.get(`/api/accounts${queryString}${separator}location=${ticketing_location}`);
        return result;
    } catch (error) {
        console.error("Failed to fetch accounts:", error);
        throw error; // optional: rethrow for error handling upstream
    }
}


export async function get_accounts_by_id_service(id) {
    const res = await axios.get('/api/accounts/' + id)
    return res.data
}

export function delete_accounts_service(id) {
    try {
        const result = axios.delete(`/api/accounts/${id}`)
        return result
    } catch (error) {

    }
}

export function update_accounts_service(data) {
    try {
        const result = axios.put(`/api/accounts/${data.id}`, data)
        return result
    } catch (error) {

    }
}