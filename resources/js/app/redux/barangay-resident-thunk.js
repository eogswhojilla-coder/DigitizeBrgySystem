import {  get_barangay_residents_by_id_service, get_barangay_residents_service } from "../services/barangay-resident-service";
import { barangayResidentSlice } from "./barangay-resident-slice";

export function get_barangay_residents_thunk() {
    return async function (dispatch, getState) {
        const res = await get_barangay_residents_service();
        dispatch(barangayResidentSlice.actions.setResidents(res.data));
    };
}


export function get_barangay_residents_by_id_thunk() {
    return async function (dispatch, getState) {
        const res = await get_barangay_residents_by_id_service();
        dispatch(barangayResidentSlice.actions.setResident(res.data));
    };
}
