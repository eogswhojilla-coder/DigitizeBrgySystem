import { get_blotters_by_id_service, get_blotters_service } from "../services/blotter-service";
import { blotterSlice } from "./blotter-slice";


export function get_blotters_thunk() {
    return async function (dispatch, getState) {
        const res = await get_blotters_service();
        dispatch(blotterSlice.actions.setBlotters(res.data));
    };
}


export function get_blotters_by_id_thunk() {
    return async function (dispatch, getState) {
        const res = await get_blotters_by_id_service();
        dispatch(blotterSlice.actions.setBlotter(res.data));
    };
}
