import { action } from 'typesafe-actions'
import {ThreadsActionTypes, Thread, ThreadComment, LikeDto} from './types'

// Here we use the `action` helper function provided by `typesafe-actions`.
// This library provides really useful helpers for writing Redux actions in a type-safe manner.
// For more info: https://github.com/piotrwitek/typesafe-actions
export const add = (thread: Thread) => action(ThreadsActionTypes.ADD, thread)
export const addComment = (id: string, clientId: string, threadComment: ThreadComment ) => action(ThreadsActionTypes.ADD_COMMENT, { id, clientId, threadComment })

export const like = (likeDto: LikeDto) => action(ThreadsActionTypes.LIKE, likeDto)
export const likeSuccess = (likeDto: LikeDto) => action(ThreadsActionTypes.LIKE_SUCCESS, likeDto)
export const userMessage = (message: string) => action(ThreadsActionTypes.USER_MESSAGE, message)

export const initSuccess = (threads: Thread[]) => action(ThreadsActionTypes.INIT_SUCCESS, threads)

// Remember, you can also pass parameters into an action creator. Make sure to
// type them properly as well.
export const fetchSuccess = () => action(ThreadsActionTypes.FETCH_SUCCESS)
export const fetchError = (message: string) => action(ThreadsActionTypes.FETCH_ERROR, message)
