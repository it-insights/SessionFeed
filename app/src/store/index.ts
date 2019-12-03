import { combineReducers } from 'redux'
import { all, fork } from '@redux-saga/core/effects'
import { connectRouter, RouterState } from 'connected-react-router'
import { History } from 'history'

import userSaga from './user/sagas'
import { userReducer } from './user/reducer'
import { UserState } from './user/types'

import threadsSaga from './threads/sagas'
import { threadsReducer } from './threads/reducer'
import { ThreadsState } from './threads/types'
import {VotesState} from "./votes/types";
import {votesReducer} from "./votes/reducer";
import votesSaga from "./votes/sagas";

// The top-level state object
export interface ApplicationState {
    user: UserState
    threads: ThreadsState
    router: RouterState
    votes: VotesState
}

// Whenever an action is dispatched, Redux will update each top-level application state property
// using the reducer with the matching name. It's important that the names match exactly, and that
// the reducer acts on the corresponding ApplicationState property type.
export const createRootReducer = (history: History) =>
    combineReducers({
        user: userReducer,
        threads: threadsReducer,
        votes: votesReducer,
        router: connectRouter(history)
    })

// Here we use `redux-saga` to trigger actions asynchronously. `redux-saga` uses something called a
// "generator function", which you can read about here:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*
export function* rootSaga() {
    yield all([fork(userSaga) , fork(threadsSaga), fork(votesSaga) ])
}