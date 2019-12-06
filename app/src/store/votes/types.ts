export enum VoteActionTypes {
    VOTE = '@@votes/VOTE',
    CHECK_VOTE = '@@votes/CHECK_VOTE',
    CHECK_VOTE_SUCCESS = '@@votes/CHECK_VOTE_SUCCESS',
    UPDATE = '@@votes/UPDATE',
    INIT_SUCCESS = '@@votes/INIT_SUCCESS',
    COMMENT = '@@votes/COMMENT',
    SUBMIT = '@@votes/SUBMIT',
    SUBMIT_SUCCESS = '@@votes/SUBMIT_SUCCESS',
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
    readonly loading: boolean,
    readonly hasVoted?: boolean,
    readonly submitPending: boolean,
}