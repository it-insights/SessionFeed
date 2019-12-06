import { all, call, fork, put, takeEvery, takeLatest } from 'redux-saga/effects'
import {User, UserActionTypes} from './types'
import {fetchError, fetchSuccess, login, loginExists, loginSuccess} from './actions'
import {callApi} from "../../utils/api";

const endpoint: string = process.env.REACT_APP_REST_ENDPOINT || 'https://sessionfeed.azurewebsites.net/api';

function* handleLogin(action: ReturnType<typeof login>) {
    try {
        const res = yield call(callApi, 'post', endpoint, 'createUser', action.payload);

        if (res.status === 409) {
            yield put(loginExists())
            return;
        }

        localStorage.setItem('user', action.payload.name);
        localStorage.setItem('avatarUrl', action.payload.avatarUrl);

        yield put(loginSuccess(action.payload.name, action.payload.avatarUrl))
    } catch (err) {
        if (err instanceof Error && err.stack) {
            yield put(fetchError(err.stack))
        } else {
            yield put(fetchError('An unknown error occured.'))
        }
    }
}

function* watchLogin() {
    yield takeLatest(UserActionTypes.LOGIN, handleLogin)
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* userSaga() {
    yield all([fork(watchLogin)])
}

export default userSaga