import { all, call, fork, put, takeEvery, takeLatest } from 'redux-saga/effects'
import {User, UserActionTypes} from './types'
import { fetchError, fetchSuccess, login, loginSuccess } from './actions'
import { callApi } from '../../utils/api'
import {act} from "react-dom/test-utils";


const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || 'https://api.opendota.com'

function* handleFetch() {
    try {
        // To call async functions, use redux-saga's `call()`.
        const res = yield call(callApi, 'get', API_ENDPOINT, '/teams')

        if (res.error) {
            yield put(fetchError(res.error))
        } else {
            yield put(fetchSuccess(res))
        }
    } catch (err) {
        if (err instanceof Error && err.stack) {
            yield put(fetchError(err.stack))
        } else {
            yield put(fetchError('An unknown error occured.'))
        }
    }
}

function* handleLogin(action: ReturnType<typeof login>) {
    try {
        yield put(loginSuccess())

        localStorage.setItem('user', action.payload);

        // const user = yield call(callApi, 'get', API_ENDPOINT, `/teams/${action.payload}`)
        //
        // if (user.error) {
        //     yield put(fetchError(user.error))
        // } else {
        //     yield put(loginSuccess(user))
        // }
    } catch (err) {
        if (err instanceof Error && err.stack) {
            yield put(fetchError(err.stack))
        } else {
            yield put(fetchError('An unknown error occured.'))
        }
    }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchFetchRequest() {
    yield takeEvery(UserActionTypes.FETCH_REQUEST, handleFetch)
}

function* watchLogin() {
    yield takeLatest(UserActionTypes.LOGIN, handleLogin)
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* userSaga() {
    yield all([fork(watchFetchRequest), fork(watchLogin)])
}

export default userSaga