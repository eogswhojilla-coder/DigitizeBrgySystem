import {
    create_activities_service,
    get_activities_by_id_service,
    get_activities_service,
    update_activities_service,
} from "../services/activities-service";
import { activitiesSlice } from "./activity-slice";

export function get_activities_thunk() {
    return async function (dispatch, getState) {
        const res = await get_activities_service();
        dispatch(activitiesSlice.actions.setActivities(res.data));
    };
}

export function create_activities_thunk(data) {
    return async function (dispatch, getState) {
        const res = await create_activities_service(data);
    };
}

export function get_activities_by_id_thunk(product_code,date) {
    return async function (dispatch, getState) {
        const res = await get_activities_by_id_service(product_code,date);
        dispatch(activitiesSlice.actions.setActivity(res.data));
    };
}

export function delete_activities_thunk(id) {
    return async function (dispatch, getState) {};
}

export function update_activities_thunk(data) {
    return async function (dispatch, getState) {
        const res = await update_activities_service(data);
    };
}

export function update_activitiess_thunk(data) {
    return async function (dispatch, getState) {};
}
