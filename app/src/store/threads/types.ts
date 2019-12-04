// This file holds our state type, as well as any other types related to this Redux store.

// Use `enum`s for better autocompletion of action type names. These will
// be compiled away leaving only the final value in your compiled code.
//
// Define however naming conventions you'd like for your action types, but
// personally, I use the `@@context/ACTION_TYPE` convention, to follow the convention
// of Redux's `@@INIT` action.
import {User} from "../user/types";

export interface ThreadComment {
    timestamp: Date,
    author: User,
    text: string
}

export interface Thread {
    clientId: string,
    id: string,
    timestamp: Date,
    author: User,
    text: string,
    likedBy: string[],
    comments: ThreadComment[]
}

export interface LikeDto {
    id: string,
    clientId: string,
    user: string
}

export enum ThreadsActionTypes {
    ADD = '@@threads/ADD',
    UPDATE = '@@threads/UPDATE',
    LIKE = '@@threads/LIKE',
    LIKE_SUCCESS = '@@threads/LIKE_SUCCESS',
    ADD_COMMENT = '@@threads/ADD_COMMENT',
    ADD_COMMENT_SUCCESS = '@@threads/ADD_COMMENT_SUCCESS',
    USER_MESSAGE = '@@threads/USER_MESSAGE',
    INIT_SUCCESS = '@@threads/INIT_SUCCESS',
    FETCH_SUCCESS = '@@threads/FETCH_SUCCESS',
    FETCH_ERROR = '@@threads/FETCH_ERROR'
}

// Declare state types with `readonly` modifier to get compile time immutability.
// https://github.com/piotrwitek/react-redux-typescript-guide#state-with-type-level-immutability
export interface ThreadsState {
    readonly loading: boolean
    readonly threads: Thread[]
    readonly errors?: string,
    readonly userMessage: string,
    readonly isVerifying: boolean
}