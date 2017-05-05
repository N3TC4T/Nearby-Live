/**
 * Combine All Reducers
 */

import { combineReducers } from 'redux';

// Our custom reducers
// We need to import each one here and add them to the combiner at the bottom
import router from '@redux/router/reducer';
import user from '@redux/user/reducer';
import stream from '@redux/stream/reducer';
import conversations from '@redux/conversations/reducer';
import notifications from '@redux/notifications/reducer';

// Combine all
const appReducer = combineReducers({
  router,
  user,
  stream,
  conversations,
  notifications,
});

// Setup root reducer
const rootReducer = (state, action) => {
  const newState = (action.type === 'RESET') ? undefined : state;
  return appReducer(newState, action);
};

export default rootReducer;
