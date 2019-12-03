export enum VoteActionTypes {
    VOTE = '@@threads/VOTE',
    VOTE_SUCCESS = '@@threads/VOTE_SUCCESS'
}

export interface Vote {
    author: string,
    rating: number,
    comment: string
}

export interface VoteCategory {
    name: string,
    rating: number,
    count: number,
    average: number
}

export interface VotesState {
    readonly categories: VoteCategory[],
    readonly comment: string,
    readonly errors: undefined,
}