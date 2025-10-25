import { createSlice } from '@reduxjs/toolkit';
import { fetchCertificateTypes, createCertificateType } from './certificate-type-thunk';

const initialState = {
    certificateTypes: [],
    loading: false,
    error: null,
};

const certificateTypeSlice = createSlice({
    name: 'certificateTypes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch certificate types
        builder.addCase(fetchCertificateTypes.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchCertificateTypes.fulfilled, (state, action) => {
            state.loading = false;
            state.certificateTypes = action.payload;
        });
        builder.addCase(fetchCertificateTypes.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Create certificate type
        builder.addCase(createCertificateType.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createCertificateType.fulfilled, (state, action) => {
            state.loading = false;
            state.certificateTypes.push(action.payload);
        });
        builder.addCase(createCertificateType.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});

export default certificateTypeSlice.reducer;