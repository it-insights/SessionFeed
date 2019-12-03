import { Reducer } from 'redux'
import {VotesState, VoteActionTypes, VoteCategory} from './types'

// Type-safe initialState!
export const initialState: VotesState = {
    categories: [{
        name: 'Category 1'
    }, {
        name: 'Category 2'
    }] as VoteCategory[],
    comment: '',
    errors: undefined,
};

// Thanks to Redux 4's much simpler typings, we can take away a lot of typings on the reducer side,
// everything will remain type-safe.
const reducer: Reducer<VotesState> = (state = initialState, action) => {
    switch (action.type) {
        case VoteActionTypes.VOTE: {
            const categoryIndex = state.categories.findIndex(el => el.name === action.payload.name);
            const category = state.categories[categoryIndex];

            if (categoryIndex !== -1) {
                const newCategory = {
                    ...category,
                    rating: action.payload.rating || category.rating,
                    count: action.payload.count || category.count,
                    average: action.payload.average || category.average
                } as VoteCategory;

                return {
                    ...state,
                    categories: [
                        ...state.categories.slice(0, categoryIndex),
                        newCategory,
                        ...state.categories.slice(categoryIndex + 1)
                    ]
                }
            }
        }
        case VoteActionTypes.COMMENT: {
            return {
                ...state,
                comment: action.payload || state.comment
            }
        }
        case VoteActionTypes.VOTE_SUCCESS: {
            return {
                ...state,
                categories: action.payload.categories
            }
        }
        default:
            return state;
    }
}

// Instead of using default export, we use named exports. That way we can group these exports
// inside the `index.js` folder.
export { reducer as votesReducer }