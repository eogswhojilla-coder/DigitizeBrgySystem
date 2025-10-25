import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCertificateTypes = createAsyncThunk(
    'certificateTypes/fetch',
    async () => {
        try {
            const response = await axios.get('/api/certificate-types');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch certificate types';
        }
    }
);

export const createCertificateType = createAsyncThunk(
    'certificateTypes/create',
    async (certificateTypeData) => {
        try {
            const response = await axios.post('/api/certificate-types', certificateTypeData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to create certificate type';
        }
    }
);