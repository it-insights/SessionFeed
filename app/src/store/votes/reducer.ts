import { Reducer } from 'redux'
import {VotesState, VoteActionTypes, VoteCategory} from './types'

// Type-safe initialState!
export const initialState: VotesState = {
    categories: [] as VoteCategory[],
    comment: '',
    errors: undefined,
};

// Thanks to Redux 4's much simpler typings, we can take away a lot of typings on the reducer side,
// everything will remain type-safe.
const reducer: Reducer<VotesState> = (state = initialState, action) => {
    switch (action.type) {
        case VoteActionTypes.VOTE: {
            return { ...state }
        }
        case VoteActionTypes.VOTE_SUCCESS: {
            return { ...state }
        }
        default:
            return state;
    }
}

// Instead of using default export, we use named exports. That way we can group these exports
// inside the `index.js` folder.
export { reducer as votesReducer }