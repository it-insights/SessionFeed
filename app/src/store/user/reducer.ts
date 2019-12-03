import { Reducer } from 'redux'
import {UserState, UserActionTypes, User} from './types'
import {act} from "react-dom/test-utils";

// Type-safe initialState!
export const initialState: UserState = {
    name: '',
    avatarUrl: '',
    isAuthenticated: false,
    errors: undefined,
    loading: false
}

// Thanks to Redux 4's much simpler typings, we can take away a lot of typings on the reducer side,
// everything will remain type-safe.
const reducer: Reducer<UserState> = (state = initialState, action) => {
    switch (action.type) {
        case UserActionTypes.FETCH_REQUEST:
        case UserActionTypes.LOGIN: {
            return { ...state, loading: true }
        }
        case UserActionTypes.LOGIN_SUCCESS: {
            return { ...state, loading: false, name: action.payload.name, avatarUrl: action.payload.avatarUrl, isAuthenticated: true }
        }
        case UserActionTypes.FETCH_SUCCESS: {
            return { ...state, loading: false, name: action.payload }
        }
        case UserActionTypes.FETCH_ERROR: {
            return { ...state, loading: false, errors: action.payload }
        }
        default: {
            return state
        }
    }
}

// Instead of using default export, we use named exports. That way we can group these exports
// inside the `index.js` folder.
export { reducer as userReducer }