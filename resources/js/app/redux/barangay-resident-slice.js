import { createSlice } from "@reduxjs/toolkit";

export const barangayResidentSlice = createSlice({
    name: "app",
    initialState: {
        residents: [],
        resident:{}

    },
    reducers: {
        setResidents: (state, action) => {
            state.residents = action.payload;
        },
        setResident: (state, action) => {
            state.resident = action.payload;
        },
    },
});
export const { setResidents,setResident } =
    barangayResidentSlice.actions;

export default barangayResidentSlice.reducer;
