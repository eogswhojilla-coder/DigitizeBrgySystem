import { get_families_service, get_family_by_id_service, create_family_service, update_family_service, delete_family_service } from "../services/family-service";
import familySlice from "./family-slice";

export function get_families_thunk() {
    return async function (dispatch, getState) {
        try {
            dispatch(familySlice.actions.setLoading(true));
            const res = await get_families_service();
            dispatch(familySlice.actions.setFamilies(res.data));
            dispatch(familySlice.actions.setLoading(false));
        } catch (error) {
            dispatch(familySlice.actions.setError(error.message));
            dispatch(familySlice.actions.setLoading(false));
        }
    };
}

export function get_family_by_id_thunk(id) {
    return async function (dispatch, getState) {
        try {
            dispatch(familySlice.actions.setLoading(true));
            const res = await get_family_by_id_service(id);
            dispatch(familySlice.actions.setFamily(res.data));
            dispatch(familySlice.actions.setLoading(false));
        } catch (error) {
            dispatch(familySlice.actions.setError(error.message));
            dispatch(familySlice.actions.setLoading(false));
        }
    };
}

export function create_family_thunk(data) {
    return async function (dispatch, getState) {
        try {
            const res = await create_family_service(data);
            dispatch(get_families_thunk());
            return res;
        } catch (error) {
            dispatch(familySlice.actions.setError(error.message));
            throw error;
        }
    };
}

export function update_family_thunk(id, data) {
    return async function (dispatch, getState) {
        try {
            const res = await update_family_service(id, data);
            dispatch(get_families_thunk());
            return res;
        } catch (error) {
            dispatch(familySlice.actions.setError(error.message));
            throw error;
        }
    };
}

export function delete_family_thunk(id) {
    return async function (dispatch, getState) {
        try {
            const res = await delete_family_service(id);
            dispatch(get_families_thunk());
            return res;
        } catch (error) {
            dispatch(familySlice.actions.setError(error.message));
            throw error;
        }
    };
}