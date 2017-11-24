/**
 * User Reducer
 */

// Set initial state
const initialState = {};

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case 'USER_REPLACE':
            return action.data;

        default:
            return state;
    }
}
