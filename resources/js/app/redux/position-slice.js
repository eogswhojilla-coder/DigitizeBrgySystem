import { createSlice } from "@reduxjs/toolkit";

export const positionsSlice = createSlice({
    name: "positions",   // better name (was "app")
    initialState: {
        positions: [],   // list of positions
        position: {}     // single position
    },
    reducers: {
        setPositions: (state, action) => {
            state.positions = action.payload;
        },
        setPosition: (state, action) => {
            state.position = action.payload;
        },
    },
});

export const { setPositions, setPosition } = positionsSlice.actions;
export default positionsSlice.reducer;
