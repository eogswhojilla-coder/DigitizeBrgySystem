import { createSlice } from "@reduxjs/toolkit";

const familySlice = createSlice({
    name: "families",
    initialState: {
        families: [],
        family: null,
        loading: false,
        error: null,
    },
    reducers: {
        setFamilies: (state, action) => {
            state.families = action.payload;
        },
        setFamily: (state, action) => {
            state.family = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setFamilies, setFamily, setLoading, setError } = familySlice.actions;
export default familySlice;