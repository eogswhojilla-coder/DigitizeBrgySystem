import { get_administrator_by_id_service, get_administrator_service } from "../services/administrator-service";

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
