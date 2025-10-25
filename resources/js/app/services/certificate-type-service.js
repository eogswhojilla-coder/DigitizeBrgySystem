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
    const response = await axios.put(`/api/certificate-types/${id}`, data);
    return response.data;
};

export const delete_certificate_type_service = async (id) => {
    const response = await axios.delete(`/api/certificate-types/${id}`);
    return response.data;
};