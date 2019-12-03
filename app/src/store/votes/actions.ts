import { action } from 'typesafe-actions'
import {VoteActionTypes, VoteCategory, VoteDto} from './types'
import {ThreadsActionTypes} from "../threads/types";

export const vote = (vote: VoteCategory) => action(VoteActionTypes.VOTE, vote)
export const dispatchComment = (comment: string) => action(VoteActionTypes.COMMENT, comment)
export const submit = (voteDto: VoteDto) => action(VoteActionTypes.SUBMIT, voteDto)

export const fetchSuccess = () => action(VoteActionTypes.FETCH_SUCCESS)
export const fetchError = (message: string) => action(VoteActionTypes.FETCH_ERROR, message)


