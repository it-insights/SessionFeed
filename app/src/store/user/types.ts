// This file holds our state type, as well as any other types related to this Redux store.

// Response object for GET /teams
// https://docs.opendota.com/#tag/teams%2Fpaths%2F~1teams%2Fget
export interface User {
    name: string
}

// Use `enum`s for better autocompletion of action type names. These will
// be compiled away leaving only the final value in your compiled code.
//
// Define however naming conventions you'd like for your action types, but
// personally, I use the `@@context/ACTION_TYPE` convention, to follow the convention
// of Redux's `@@INIT` action.
export enum UserActionTypes {
    SET_NAME = '@@user/SET_NAME',
    FETCH_REQUEST = '@@user/FETCH_REQUEST',
    FETCH_SUCCESS = '@@user/FETCH_SUCCESS',
    FETCH_ERROR = '@@user/FETCH_ERROR',
    LOGIN = '@@user/LOGIN',
    LOGIN_SUCCESS = '@@user/LOGIN_SUCCESS',
    LOGIN_EXISTS = '@@user/LOGIN_EXISTS'
}

// Declare state types with `readonly` modifier to get compile time immutability.
// https://github.com/piotrwitek/react-redux-typescript-guide#state-with-type-level-immutability
export interface UserState {
    readonly loading: boolean
    readonly isAuthenticated: boolean
    readonly name: string
    readonly errors?: string
}