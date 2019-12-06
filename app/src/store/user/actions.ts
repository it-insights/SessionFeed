import { action } from 'typesafe-actions'
import { UserActionTypes, User } from './types'

// Here we use the `action` helper function provided by `typesafe-actions`.
// This library provides really useful helpers for writing Redux actions in a type-safe manner.
// For more info: https://github.com/piotrwitek/typesafe-actions
export const fetchRequest = () => action(UserActionTypes.FETCH_REQUEST)

// Remember, you can also pass parameters into an action creator. Make sure to
// type them properly as well.
export const fetchSuccess = (data: User) => action(UserActionTypes.FETCH_SUCCESS, data)
export const fetchError = (message: string) => action(UserActionTypes.FETCH_ERROR, message)
export const login = (name: string, avatarUrl: string) => action(UserActionTypes.LOGIN, { name, avatarUrl })
export const loginSuccess = (name: string, avatarUrl: string) => action(UserActionTypes.LOGIN_SUCCESS, { name, avatarUrl })
export const loginExists = () => action(UserActionTypes.LOGIN_EXISTS)


