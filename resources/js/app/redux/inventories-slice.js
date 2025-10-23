import { createSlice } from "@reduxjs/toolkit";

export const inventoriesSlice = createSlice({
    name: "app",
    initialState: {
        inventories: [],
        inventory:{}

    },
    reducers: {
        setInventory: (state, action) => {
            state.inventory = action.payload;
        },
        setInventories: (state, action) => {
            state.inventories = action.payload;
        },
    },
});
export const { setInventories,setInventory } =
    inventoriesSlice.actions;

export default inventoriesSlice.reducer;
