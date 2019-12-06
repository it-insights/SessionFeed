export enum VoteActionTypes {
    VOTE = '@@votes/VOTE',
    VOTE_SUCCESS = '@@votes/VOTE_SUCCESS',
    INIT_SUCCESS = '@@votes/INIT_SUCCESS',
    COMMENT = '@@votes/COMMENT',
    SUBMIT = '@@votes/SUBMIT',
    FETCH_SUCCESS = '@@votes/FETCH_SUCCESS',
    FETCH_ERROR = '@@votes/FETCH_ERROR',
}

export interface VoteDto {
    categories: VoteCategory[],
    author: string,
    email: string,
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