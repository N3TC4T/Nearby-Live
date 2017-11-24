/**
 * Conversations Actions
 */

import AppAPI from '@lib/api';

export function getConversations(startFrom) {
    return dispatch => AppAPI.conversations.get({start: startFrom, count: 25, include: 'text'})
        .then((res) => {
            dispatch({
                type: 'CONVERSATIONS_REPLACE',
                data: res
            });
        });
}

export function deleteConversation(pid) {
    return (dispatch) => {
        // for better ux we delete conversation first and then send delete request to server
        dispatch({
            type: 'CONVERSATION_DELETE',
            id: pid
        });

        return AppAPI.conversations.post({id: pid, action: 'delete'});
    };
}

export function deleteConversations() {
    return dispatch => AppAPI.conversations.post({action: 'delete'})
        .finally(() => {
            dispatch({
                type: 'CONVERSATIONS_DELETE'
            });
        });
}

export function uninitializeConversation(pid) {
    return (dispatch) => {
        dispatch({
            type: 'CONVERSATION_UNINITIALIZE',
            id: pid
        });
    };
}

export function getMessages(params) {
    return (dispatch) => {
        let startFrom = 0;

        if (params.initialized) {
            startFrom = params.last;
        }

        return AppAPI.conversations.get({id: params.id, count: 15, start: startFrom})
            .then((res) => {
                // we don't need to pass id from server , we create default uuid
                // we delete unread too cuz its not working fine
                res.map((obj) => { delete obj.id; delete obj.unread; return null; });
                dispatch({
                    type: 'MESSAGES_REPLACE',
                    data: res,
                    id: params.id
                });
            }) // then we update messages receipt status in async
            .then(() => {
                AppAPI.conversations.get({id: params.id, action: 'receipt'})
                    .then((res) => {
                        if (res === 1) {
                            dispatch({
                                type: 'MESSAGES_READ',
                                id: params.id
                            });
                        }
                    });
            });
    };
}

export function sendMessage(message, pid) {
    return (dispatch) => {
        // for better user experience first we show message as sending and then sent http request
        dispatch({
            type: 'MESSAGE_SEND',
            data: message,
            id: pid
        });
        // sending http request and then set message as sent
        return AppAPI.conversations.post({id: pid}, message.body)
            .then((res) => {
                dispatch({
                    type: 'MESSAGE_SENT',
                    id: message.id,
                    msgid: res.id

                });
            }) // then update message receipt status but better send with 4 sec delay
            .then(() => new Promise(r => setTimeout(r, 4000)))
            .then(() => {
                AppAPI.conversations.get({id: pid, action: 'receipt'})
                    .then((res) => {
                        if (res === 1) {
                            dispatch({
                                type: 'MESSAGES_READ',
                                id: pid
                            });
                        }
                    });
            });
    };
}
