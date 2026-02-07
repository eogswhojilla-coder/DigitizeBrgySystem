import { get_pending_accounts_service } from "../services/registration-service";
import { pendingAccountsSlice } from "./pending-accounts-slice";

export function get_pending_accounts_thunk() {
    return async function (dispatch, getState) {
        const res = await get_pending_accounts_service();
        dispatch(pendingAccountsSlice.actions.setPendingAccounts(res.data));
    };
}
