import { createSlice } from "@reduxjs/toolkit";

export const borrowRequestsSlice = createSlice({
    name: "borrowRequests",
    initialState: {
        borrowRequests: [],
        loading: false,
        error: null,
    },
    reducers: {
        setBorrowRequests: (state, action) => {
            state.borrowRequests = action.payload;
            state.loading = false;
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const { setBorrowRequests, setLoading, setError } = borrowRequestsSlice.actions;

export default borrowRequestsSlice.reducer;
