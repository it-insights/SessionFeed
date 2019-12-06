import { Reducer } from 'redux'
import { ThreadsState, Thread, ThreadComment, ThreadsActionTypes } from './types'
import {act} from "react-dom/test-utils";
import thread from "../../pages/thread";
import {like} from "./actions";

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
        case ThreadsActionTypes.ADD_COMMENT: {
            const index = state.threads.findIndex(el => el.id === action.payload.id);
            const thread = state.threads[index];

            if (index !== -1) {
                return {
                    ...state,
                    isVerifying: true,
                    threads: [
                        ...state.threads.slice(0, index),
                        { ...thread, comments: [ ...thread.comments, action.payload.comment ] },
                        ...state.threads.slice(index + 1)
                    ]
                }
            }
        }
        case ThreadsActionTypes.LIKE: {
            const index = state.threads.findIndex(el => el.id === action.payload.id);
            const thread = state.threads[index];

            if (thread.likedBy.indexOf(action.payload.author) !== -1) {
                return state;
            }

            if (index !== -1) {
                return {
                    ...state,
                    isVerifying: true,
                    threads: [
                        ...state.threads.slice(0, index),
                        { ...thread, likedBy: [ ...thread.likedBy, action.payload.author ] },
                        ...state.threads.slice(index + 1)
                    ].sort((a, b) => b.likedBy.length - a.likedBy.length)
                }
            }

            return state;
        }
        case ThreadsActionTypes.UPDATE: {
            let threads = [ ...state.threads ] as Thread[]

            for (const thread of action.payload as Thread[]) {
                thread.likedBy = thread.likedBy || [];
                thread.comments = thread.comments || [];

                // Check if message already present / current client already has object in state
                const index = threads.findIndex(el => el.clientId === thread.clientId);

                // Replace to add missing metadata
                if (index !== -1) {
                    threads = [...threads.slice(0, index), thread, ...threads.slice(index + 1)]
                // Just add as it is an update from the server
                } else {
                    threads = [...threads, thread]
                }
            }

            return { ...state, threads: threads.sort((a, b) => b.likedBy.length - a.likedBy.length) }
        }
        case ThreadsActionTypes.INIT_SUCCESS: {
            return { ...state, loading: false, threads: action.payload.map((t :Thread) => ({...t, likedBy: t.likedBy || [], comments: t.comments || [] })) }
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