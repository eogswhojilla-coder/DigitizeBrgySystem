import { createSlice } from "@reduxjs/toolkit";

export const pendingAccountsSlice = createSlice({
    name: "pendingAccounts",
    initialState: {
        accounts: [],
    },
    reducers: {
        setPendingAccounts: (state, action) => {
            state.accounts = action.payload;
        },
    },
});

export const { setPendingAccounts } = pendingAccountsSlice.actions;

export default pendingAccountsSlice.reducer;
