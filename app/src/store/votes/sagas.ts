import { all, call, fork, put, takeEvery, takeLatest } from 'redux-saga/effects'
import {VoteActionTypes} from './types'
import {fetchError, submit, checkVote, checkVoteSuccess } from './actions'

import { callApi } from '../../utils/api'

const endpoint: string = process.env.REACT_APP_REST_ENDPOINT || 'https://sessionfeed.azurewebsites.net/api';

function* handleCheckVote(action: ReturnType<typeof checkVote>) {
    try {
        const res = yield call(callApi, 'get', endpoint, `getVote/${action.payload}`);

        if (res.error) {
            yield put(fetchError(res.error))
        }

        if (res.payload) {
            yield put(checkVoteSuccess(true))
        } else {
            yield put(checkVoteSuccess(false))
        }
    } catch (err) {
        if (err instanceof Error && err.stack) {
            yield put(fetchError(err.stack))
        } else {
            yield put(fetchError('An unknown error occurred.'))
        }
    }
}

function* handleSubmit(action: ReturnType<typeof submit>) {
    try {
        const res = yield call(callApi, 'post', endpoint, 'placeVote', action.payload);

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

function* watchCheckVote() {
    yield takeLatest(VoteActionTypes.CHECK_VOTE, handleCheckVote)
}

function* votesSaga() {
    yield all([fork(watchSubmit), fork(watchCheckVote)])
}

export default votesSaga