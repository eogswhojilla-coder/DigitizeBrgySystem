import { createSlice } from "@reduxjs/toolkit";

export const blotterSlice = createSlice({
    name: "app",
    initialState: {
        blotters: [],
        blotter:{}

    },
    reducers: {
        setBlotters: (state, action) => {
            state.blotters = action.payload;
        },
        setBlotter: (state, action) => {
            state.blotter = action.payload;
        },
    },
});
export const { setBlotters,setBlotter } =
    blotterSlice.actions;

export default blotterSlice.reducer;
