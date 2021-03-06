import { action } from 'typesafe-actions'
import {VoteActionTypes, VoteCategory, VoteDto} from './types'
import {ThreadsActionTypes} from "../threads/types";

export const vote = (vote: VoteCategory) => action(VoteActionTypes.VOTE, vote)
export const checkVote = (user: string) => action(VoteActionTypes.CHECK_VOTE, user)
export const checkVoteSuccess = (result?: VoteDto) => action(VoteActionTypes.CHECK_VOTE_SUCCESS, result)
export const dispatchComment = (comment: string) => action(VoteActionTypes.COMMENT, comment)
export const submit = (voteDto: VoteDto) => action(VoteActionTypes.SUBMIT, voteDto)
export const submitSuccess = () => action(VoteActionTypes.SUBMIT_SUCCESS)

export const fetchSuccess = () => action(VoteActionTypes.FETCH_SUCCESS)
export const fetchError = (message: string) => action(VoteActionTypes.FETCH_ERROR, message)


