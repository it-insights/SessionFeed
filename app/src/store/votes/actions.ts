import { action } from 'typesafe-actions'
import { VoteActionTypes, Vote } from './types'

export const vote = (vote: Vote) => action(VoteActionTypes.VOTE, vote)
export const voteSuccess = (vote: Vote) => action(VoteActionTypes.VOTE_SUCCESS, vote)



