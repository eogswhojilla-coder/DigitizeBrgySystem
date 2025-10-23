import { create_accounts_service, get_account_by_department_service, get_accounts_by_id_service, get_accounts_service, update_accounts_service } from "../services/accounts-service";
import { accountSlice } from "./account-slice";



export function get_account_by_department_thunk(data) {
    return async function (dispatch, getState) {
        const res = await get_account_by_department_service(data);
        dispatch(accountSlice.actions.setAccounts(res.data));
    };
}

export function get_accounts_thunk() {
    return async function (dispatch, getState) {
        const res = await get_accounts_service();
        dispatch(accountSlice.actions.setAccounts(res.data));
    };
}

export function create_accounts_thunk(data) {
    return async function (dispatch, getState) {
        const res = await create_accounts_service(data);
    };
}

export function get_accounts_by_id_thunk(product_code,date) {
    return async function (dispatch, getState) {
        const res = await get_accounts_by_id_service(product_code,date);
        dispatch(accountSlice.actions.setAccount(res.data));
    };
}

export function delete_accounts_thunk(id) {
    return async function (dispatch, getState) {};
}

export function update_accounts_thunk(data) {
    return async function (dispatch, getState) {
        const res = await update_accounts_service(data);
    };
}

export function update_accountss_thunk(data) {
    return async function (dispatch, getState) {};
}
