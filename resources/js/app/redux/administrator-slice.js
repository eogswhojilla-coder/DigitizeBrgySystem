import { createSlice } from "@reduxjs/toolkit";

export const administratorSlice = createSlice({
    name: "app",
    initialState: {
        administrators: [],
        administrator:{}

    },
    reducers: {
        setAdministrators: (state, action) => {
            state.administrators = action.payload;
        },
        setAdministrator: (state, action) => {
            state.administrator = action.payload;
        },
    },
});
export const { setAdministrators,setAdministrator } =
    administratorSlice.actions;

export default administratorSlice.reducer;
