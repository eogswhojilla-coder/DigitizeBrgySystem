import axios from 'axios';

export const create_certificate_type_service = async (data) => {
    const response = await axios.post('/api/certificate-types', data);
    return response.data;
};

export const get_certificate_types_service = async () => {
    const response = await axios.get('/api/certificate-types');
    return response.data;
};

export const update_certificate_type_service = async (id, data) => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    formData.append('has_fee', data.has_fee ? '1' : '0');
    if (data.has_fee) {
        if (data.fee) formData.append('fee', data.fee);
        if (data.gcash_qr && data.gcash_qr.length > 0) {
            formData.append('gcash_qr', data.gcash_qr[0]);
        }
    }
    const response = await axios.post(`/api/certificate-types/${id}`, formData);
    return response.data;
};

export const delete_certificate_type_service = async (id) => {
    const response = await axios.delete(`/api/certificate-types/${id}`);
    return response.data;
};