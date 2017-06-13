
export function connected() {
    return { type: 'SOCKET_CONNECTED' }
}

export function disconnected() {
    return { type: 'SOCKET_DISCONNECTED' }
}

export function messageReceived(msg) {

    if (msg.IsNewMessage) {
        return {
            type: 'CONVERSATIONS_UNREAD_COUNT_UPDATE',
            data: parseInt(msg.UnreadMessages)
        };
    }

    if (msg.IsNewComment){
        return {
            type: 'WATCHED_UNREAD_COUNT_UPDATE',
            data: parseInt(msg.UnreadPosts)
        };
    }

    return { type: 'SOCKET_CONNECTED' }

}