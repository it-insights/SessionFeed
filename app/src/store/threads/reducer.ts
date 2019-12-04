import { Reducer } from 'redux'
import { ThreadsState, Thread, ThreadComment, ThreadsActionTypes } from './types'
import {act} from "react-dom/test-utils";
import thread from "../../pages/thread";

// Type-safe initialState!
export const initialState: ThreadsState = {
    threads: [] as Thread[],
    errors: undefined,
    loading: true,
    isVerifying: true,
    userMessage: ''
}

// Thanks to Redux 4's much simpler typings, we can take away a lot of typings on the reducer side,
// everything will remain type-safe.
const reducer: Reducer<ThreadsState> = (state = initialState, action) => {
    switch (action.type) {
        case ThreadsActionTypes.ADD: {
            return { ...state, isVerifying: true, threads: [ ...state.threads, action.payload ] }
        }
        case ThreadsActionTypes.LIKE:
        case ThreadsActionTypes.ADD_COMMENT: {
            return { ...state, isVerifying: true }
        }
        case ThreadsActionTypes.UPDATE: {
            for (const thread in action.payload) {
                // Check if message already present / current client already has object in state
                const threadIndex = state.threads.findIndex(el => el.clientId === action.payload.clientId);

                // Replace to add missing metadata
                if (threadIndex !== -1) {
                    return {
                        ...state,
                        threads: [...state.threads.slice(0, threadIndex), action.payload, ...state.threads.slice(threadIndex + 1)]
                    }
                // Just add as it is an update from the server
                } else {
                    return {...state, threads: [...state.threads, action.payload]}
                }
            }
        }
        case ThreadsActionTypes.INIT_SUCCESS: {
            return { ...state, loading: false, threads: action.payload }
        }
        case ThreadsActionTypes.USER_MESSAGE: {
            return { ...state, userMessage: action.payload }
        }
        default: {
            return state
        }
    }
}

// Instead of using default export, we use named exports. That way we can group these exports
// inside the `index.js` folder.
export { reducer as threadsReducer }