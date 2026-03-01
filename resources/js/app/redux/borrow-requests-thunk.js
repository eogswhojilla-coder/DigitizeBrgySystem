import { 
    get_borrow_requests_service, 
    approve_borrow_request_service,
    decline_borrow_request_service,
    mark_as_returned_service
} from "../services/borrow-request-service";
import { borrowRequestsSlice } from "./borrow-requests-slice";

export function get_borrow_requests_thunk(status = '') {
    return async function (dispatch, getState) {
        try {
            dispatch(borrowRequestsSlice.actions.setLoading(true));
            const res = await get_borrow_requests_service(status);
            dispatch(borrowRequestsSlice.actions.setBorrowRequests(res.data.data));
        } catch (error) {
            dispatch(borrowRequestsSlice.actions.setError(error.message));
        }
    };
}

export function approve_borrow_request_thunk(id, remarks = '') {
    return async function (dispatch, getState) {
        try {
            await approve_borrow_request_service(id, remarks);
            // Refresh the list after approval
            const currentState = getState();
            const currentStatus = ''; // or get from state if you're tracking it
            dispatch(get_borrow_requests_thunk(currentStatus));
        } catch (error) {
            throw error;
        }
    };
}

export function decline_borrow_request_thunk(id, remarks) {
    return async function (dispatch, getState) {
        try {
            await decline_borrow_request_service(id, remarks);
            // Refresh the list after decline
            dispatch(get_borrow_requests_thunk(''));
        } catch (error) {
            throw error;
        }
    };
}

export function mark_as_returned_thunk(id, condition_after_return, remarks = '') {
    return async function (dispatch, getState) {
        try {
            await mark_as_returned_service(id, condition_after_return, remarks);
            // Refresh the list after marking as returned
            dispatch(get_borrow_requests_thunk(''));
        } catch (error) {
            throw error;
        }
    };
}
