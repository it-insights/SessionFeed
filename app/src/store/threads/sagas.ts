import { all, call, fork, put, takeEvery, takeLatest } from 'redux-saga/effects'
import {ThreadsActionTypes, Thread, ThreadComment, LikeDto} from './types'
import {fetchError, fetchSuccess, add, like, userMessage, likeSuccess, addComment} from './actions'

import { callApi } from '../../utils/api'

function* handleAdd(action: ReturnType<typeof add>) {
    try {
        if (!action.payload.id) {
            const res = yield call(callApi, 'post', 'http://localhost:8080', 'threads', action.payload);

            if (res.error) {
                yield put(fetchError(res.error))
            }
        }
    } catch (err) {
        if (err instanceof Error && err.stack) {
            yield put(fetchError(err.stack))
        } else {
            yield put(fetchError('An unknown error occurred.'))
        }
    }
}

function* handleAddComment(action: ReturnType<typeof addComment>) {
    try {
        const res = yield call(callApi, 'post', 'http://localhost:8080', 'threads/comment', action.payload);

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

function* handleLike(action: ReturnType<typeof like>) {
    try {
        const res = yield call(callApi, 'post', 'http://localhost:8080', 'threads/like', action.payload);

        if (res.error) {
            if (res.status === 409) {
                yield put(userMessage('You cannot like the same question twice.'))
            } else {
                yield put(fetchError(res.error))
            }
        } else {
            yield put(likeSuccess(res.likeResult as LikeDto))
        }
    } catch (err) {
        if (err instanceof Error && err.stack) {
            yield put(fetchError(err.stack))
        } else {
            yield put(fetchError('An unknown error occurred.'))
        }
    }
}

function* watchAdd() {
    yield takeEvery(ThreadsActionTypes.ADD, handleAdd)
}

function* watchAddComment() {
    yield takeEvery(ThreadsActionTypes.ADD_COMMENT, handleAddComment)
}

function* watchLike() {
    yield takeEvery(ThreadsActionTypes.LIKE, handleLike)
}

function* threadsSaga() {
    yield all([fork(watchAdd), fork(watchLike), fork(watchAddComment)])
}

export default threadsSaga