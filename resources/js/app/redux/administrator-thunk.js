import { get_administrator_by_id_service, get_administrator_service, assign_role_service } from "../services/administrator-service";

import { administratorSlice } from "./administrator-slice";


export function get_administrator_thunk() {
    return async function (dispatch, getState) {
        const res = await get_administrator_service();
        dispatch(administratorSlice.actions.setAdministrators(res.data));
    };
}


export function get_administrator_by_id_thunk() {
    return async function (dispatch, getState) {
        const res = await get_administrator_by_id_service();
        dispatch(administratorSlice.actions.setAdministrator(res.data));
    };
}

export function assign_role_thunk(data) {
    return async function (dispatch, getState) {
        const res = await assign_role_service(data);
        // Refresh the administrators list after assigning role
        const refreshRes = await get_administrator_service();
        dispatch(administratorSlice.actions.setAdministrators(refreshRes.data));
        return res;
    };
}
