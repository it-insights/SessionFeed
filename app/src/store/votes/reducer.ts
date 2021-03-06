import { Reducer } from 'redux'
import {VotesState, VoteActionTypes, VoteCategory} from './types'
import {Thread} from "../threads/types";
import {act} from "react-dom/test-utils";

// Type-safe initialState!
export const initialState: VotesState = {
    categories: [],
    comment: '',
    loading: true,
    hasVoted: undefined,
    submitPending: false,
    errors: undefined,
};

// Thanks to Redux 4's much simpler typings, we can take away a lot of typings on the reducer side,
// everything will remain type-safe.
const reducer: Reducer<VotesState> = (state = initialState, action) => {
    switch (action.type) {
        case VoteActionTypes.INIT_SUCCESS: {
            return { ...state, categories: action.payload }
        }
        case VoteActionTypes.SUBMIT: {
            return { ...state, submitPending: true }
        }
        case VoteActionTypes.SUBMIT_SUCCESS: {
            return { ...state, submitPending: false, hasVoted: true }
        }
        case VoteActionTypes.CHECK_VOTE: {
            return { ...state, loading: true }
        }
        case VoteActionTypes.CHECK_VOTE_SUCCESS: {
            if (!action.payload) {
                return { ...state, loading: false, hasVoted: false }
            }

            let categories = [ ...state.categories ] as VoteCategory[];

            for (const categoryUpdate of action.payload.categories as VoteCategory[]) {
                const index = categories.findIndex(el => el.name === categoryUpdate.name);

                // Replace to add missing metadata
                if (index !== -1) {
                    categories = [...categories.slice(0, index), { ...categories[index], rating: categoryUpdate.rating }, ...categories.slice(index + 1)]
                }
            }

            return {
                ...state,
                categories,
                comment: action.payload.comment,
                hasVoted: true,
                loading: false
            }

        }
        case VoteActionTypes.VOTE: {
            if (!state.categories)
                return state;

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
        case VoteActionTypes.UPDATE: {
            if (!state.categories)
                return state;

            let categories = [ ...state.categories ] as VoteCategory[]

            for (const categoryUpdate of action.payload as VoteCategory[]) {
                const index = categories.findIndex(el => el.name === categoryUpdate.name);

                // Replace to add missing metadata
                if (index !== -1) {
                    // Dont loose current users rating...
                    categories = [...categories.slice(0, index), { ...categoryUpdate, rating: categories[index].rating }, ...categories.slice(index + 1)]
                }
            }

            return {
                ...state,
                categories
            }
        }
        default:
            return state;
    }
}

// Instead of using default export, we use named exports. That way we can group these exports
// inside the `index.js` folder.
export { reducer as votesReducer }