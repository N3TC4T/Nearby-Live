const initialState = {
    connectionStatus: 'DISCONNECTED'
};

export default function socketReducer(state = initialState, action) {
    switch (action.type) {
        case 'SOCKET_CONNECTED':
            return {
                ...state,
                connectionStatus: 'CONNECTED'
            };
        case 'SOCKET_DISCONNECTED':
            return {
                ...state,
                connectionStatus: 'DISCONNECTED'
            };
        default:
            return state;
    }
}
