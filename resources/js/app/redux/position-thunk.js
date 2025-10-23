import { get_positions_service, get_positions_by_id_service } from "../services/positions-service";
import { setPositions, setPosition } from "./position-slice";

// Get all positions
export function get_positions_thunk() {
  return async function (dispatch) {
    const res = await get_positions_service();

    // ✅ if it's paginated, extract the "data" array
    const data = res.data.data ? res.data.data : res.data;
    dispatch(setPositions(data));
  };
}

// Get position by ID
export function get_positions_by_id_thunk(id) {
  return async function (dispatch) {
    const res = await get_positions_by_id_service(id);
    dispatch(setPosition(res.data));
  };
}
