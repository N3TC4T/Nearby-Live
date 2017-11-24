/**
 * Middleware for handling api responses
 */

const apiMiddleware = store => next => (action) => {
    switch (action.type) {
        case 'API_SUCCESS_RESPONSE':
        // Update badges count by x-badges header
            if (action.headers && action.headers.has('x-badges')) {
            // parse x-badges header
            // can be parse with /([a-z,A-Z]\d+)/g too
                const mVar = action.headers.get('x-badges').match(/([m]\d+)/g)[0].replace('m', '');
                const wVar = action.headers.get('x-badges').match(/([w]\d+)/g)[0].replace('w', '');
                const sVar = action.headers.get('x-badges').match(/([S]\d+)/g)[0].replace('S', '');

                // get current state
                const state = store.getState();

                // call reducer if counts changed

                if (state.conversations.UnreadCount !== mVar) {
                    store.dispatch({
                        type: 'CONVERSATIONS_UNREAD_COUNT_UPDATE',
                        data: parseInt(mVar, 0)
                    });
                }

                if (state.stream.UnreadCount !== wVar) {
                    store.dispatch({
                        type: 'WATCHED_UNREAD_COUNT_UPDATE',
                        data: parseInt(wVar, 0)
                    });
                }

                if (state.systemNotifications.UnreadCount !== sVar) {
                    store.dispatch({
                        type: 'SYSTEM_NOTIFICATIONS_UNREAD_COUNT_UPDATE',
                        data: parseInt(sVar, 0)
                    });
                }
            }
            break;

        default:
    }
    return next(action);
};

export default apiMiddleware;
