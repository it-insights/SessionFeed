import { all, call, fork, put, takeEvery } from 'redux-saga/effects'
import {VoteActionTypes} from './types'
import {fetchError, submit } from './actions'

import { callApi } from '../../utils/api'

function* handleSubmit(action: ReturnType<typeof submit>) {
    try {
        const res = yield call(callApi, 'post', 'http://localhost:8080', 'vote', action.payload);

        if (res.error) {
            yield put(fetchError(res.error))
        }
    } catch (err) {
        if (err instanceof Error && err.stack) {
            yield put(fetchError(err.stack))
        } else {
            yield put(fetchError('An unknown error occurred.'))
        }
    }
}

function* watchSubmit() {
    yield takeEvery(VoteActionTypes.SUBMIT, handleSubmit)
}

function* votesSaga() {
    yield all([fork(watchSubmit)])
}

export default votesSaga