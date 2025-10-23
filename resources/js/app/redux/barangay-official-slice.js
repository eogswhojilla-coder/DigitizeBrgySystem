import { createSlice } from "@reduxjs/toolkit";

export const barangayOfficialSlice = createSlice({
    name: "app",
    initialState: {
        officials: [],
        official:{}

    },
    reducers: {
        setOfficials: (state, action) => {
            state.officials = action.payload;
        },
        setOfficial: (state, action) => {
            state.official = action.payload;
        },
    },
});
export const { setOfficials,setOfficial } =
    barangayOfficialSlice.actions;

export default barangayOfficialSlice.reducer;
