
import { get_barangay_officials_by_id_service, get_barangay_officials_service } from "../services/barangay-official";
import { barangayOfficialSlice } from "./barangay-official-slice";


export function get_barangay_officials_thunk() {
    return async function (dispatch, getState) {
        const res = await get_barangay_officials_service();
        dispatch(barangayOfficialSlice.actions.setOfficials(res.data));
    };
}


export function get_barangay_officials_by_id_thunk() {
    return async function (dispatch, getState) {
        const res = await get_barangay_officials_by_id_service();
        dispatch(barangayOfficialSlice.actions.setOfficial(res.data));
    };
}
