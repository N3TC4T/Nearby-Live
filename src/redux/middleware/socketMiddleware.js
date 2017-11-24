// Websocket
import WebSocket from 'reconnecting-websocket';

// Actions
import * as actions from '@redux/core/ws/actions';

const socketMiddleware = (() => {
    let socket = null;

    const onOpen = (ws, store, token) => () => {
        // Send authenticate with remote
        ws.send(`token=${token}`);
        // Tell the store we're connected
        store.dispatch(actions.connected());
    };

    const onClose = (ws, store) => () => {
        // Tell the store we've disconnected
        store.dispatch(actions.disconnected());
    };

    const onMessage = (ws, store) => (evt) => {
        // Parse the JSON message received on the websocket
        const msg = JSON.parse(evt.data);

        console.log(msg);
        // handle actions
        store.dispatch(actions.messageReceived(msg));
    };

    return store => next => (action) => {
        switch (action.type) {
            case 'CONNECT':
            // Start a new connection to the server
                if (socket !== null) {
                    socket.close();
                }

                socket = new WebSocket('wss://www.wnmlive.com/mobile-ws.ashx');
                socket.onmessage = onMessage(socket, store);
                socket.onclose = onClose(socket, store);
                socket.onopen = onOpen(socket, store, action.token);

                break;

            // The user wants us to disconnect
            case 'DISCONNECT':
                if (socket !== null) {
                    socket.close();
                }
                socket = null;

                // Set our state to disconnected
                store.dispatch(actions.disconnected());
                break;

            // This action is irrelevant to us, pass it on to the next middleware
            default:
                return next(action);
        }

        return next(action);
    };
})();

export default socketMiddleware;
