/**
 * Combine All Reducers
 */

import { combineReducers } from 'redux';

// Our custom reducers
// We need to import each one here and add them to the combiner at the bottom
import router from '@redux/core/router/reducer';
import user from '@redux/core/user/reducer';
import stream from '@redux/core/stream/reducer';
import conversations from '@redux/core//conversations/reducer';
import systemNotifications from '@redux/core/system-notifications/reducer';
import socket from '@redux/core/ws/reducer';

// Combine all
const appReducer = combineReducers({
    router,
    user,
    stream,
    conversations,
    systemNotifications,
    socket,
});

// Setup root reducer
const rootReducer = (state, action) => {
    const newState = (action.type === 'RESET') ? undefined : state;
    return appReducer(newState, action);
};

export default rootReducer;
