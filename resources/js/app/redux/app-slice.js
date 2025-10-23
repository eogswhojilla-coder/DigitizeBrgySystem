import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
    name: "app",
    initialState: {
        user: {},
        sidebarOpen:false,
        carts:[]
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
         setSidebarOpen: (state, action) => {
            state.sidebarOpen = action.payload;
        },
        setCarts: (state, action) => {
            state.carts = action.payload;
        },
    },
});
export const { setUser,setSidebarOpen,setCarts } =
    appSlice.actions;

export default appSlice.reducer;
