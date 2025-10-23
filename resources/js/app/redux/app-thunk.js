

export function get_user_thunk() {
    return async function (dispatch, getState) {
        // const res = await get_user_service()
        // dispatch(appSlice.actions.setUser(res.data));
    };
}

export function get_users_thunk() {
    return async function (dispatch, getState) {
        // const res = await get_users_service()
        // dispatch(appSlice.actions.setUsers(res.data.status));
    };
}

export function create_user_thunk(data) {
    return async function (dispatch, getState) {

    };
}

export function get_user_by_id_thunk(id) {
    return async function (dispatch, getState) {
        return ''
    };
}


export function delete_user_thunk(id) {
    return async function (dispatch, getState) {
    };
}


export function update_user_thunk(data) {
    return async function (dispatch, getState) {
    };
}

export function update_users_thunk(data) {
    return async function (dispatch, getState) {
    };
}