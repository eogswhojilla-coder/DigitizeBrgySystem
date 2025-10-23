import {  get_inventories_by_id_service, get_inventories_service } from "../services/inventories-service";
import {inventoriesSlice} from "./inventories-slice";


export function get_inventories_thunk() {
    return async function (dispatch, getState) {
        const res = await get_inventories_service();
        dispatch(inventoriesSlice.actions.setInventories(res.data));
    };
}


export function get_inventories_by_id_thunk() {
    return async function (dispatch, getState) {
        const res = await get_inventories_by_id_service();
        dispatch(inventoriesSlice.actions.setInventory(res.data));
    };
}
