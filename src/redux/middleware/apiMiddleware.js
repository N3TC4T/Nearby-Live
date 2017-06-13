/**
 * Middleware for handling api responses
 */


const apiMiddleware = store => next => (action) => {
    switch (action.type) {
        case 'API_SUCCESS_RESPONSE' :
            // Update badges count by x-badges header
            if (action.headers && action.headers.has('x-badges')){

                // parse x-badges header
                // can be parse with /([a-z,A-Z]\d+)/g too
                m_var = action.headers.get('x-badges').match(/([m]\d+)/g)[0].replace('m','');
                w_var = action.headers.get('x-badges').match(/([w]\d+)/g)[0].replace('w','');
                S_var = action.headers.get('x-badges').match(/([S]\d+)/g)[0].replace('S','');

                // get current state
                let state = store.getState()

                // call reducer if counts changed

                if(state.conversations.UnreadCount != m_var ){
                    store.dispatch({
                        type:'CONVERSATIONS_UNREAD_COUNT_UPDATE',
                        data: parseInt(m_var)
                    })
                }

                if(state.stream.UnreadCount != w_var ){
                    store.dispatch({
                        type:'WATCHED_UNREAD_COUNT_UPDATE',
                        data: parseInt(w_var)
                    })
                }

                if(state.systemNotifications.UnreadCount != S_var ){
                    store.dispatch({
                        type:'SYSTEM_NOTIFICATIONS_UNREAD_COUNT_UPDATE',
                        data: parseInt(S_var)
                    })
                }


            }
            break;

        default :
    }
    return next(action);
};

export default apiMiddleware;
