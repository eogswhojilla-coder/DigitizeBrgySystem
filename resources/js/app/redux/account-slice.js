import { createSlice } from "@reduxjs/toolkit";

export const accountSlice = createSlice({
    name: "accounts",
    initialState: {
        account: {},
        accounts:[]
    },
    reducers: {
        setAccount: (state, action) => {
            state.account = action.payload;
        },
         setAccounts: (state, action) => {
            state.accounts = action.payload;
        },
    },
});
export const { setAccount,setAccounts } =
    accountSlice.actions;

export default accountSlice.reducer;
