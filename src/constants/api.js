/**
 * API Config
 */

export default {
    // The API URL we're connecting to
    apiUrl: 'https://www.wnmlive.com/api',

    // Map short names to the actual endpoints, so that we can
    // use them like so: AppAPI.ENDPOINT_NAME.METHOD()
    //  NOTE: They should start with a /
    //    eg.
    //    - AppAPI.posts.get()
    //    - AppAPI.post.post()
    //    - AppAPI.post.delete()
    endpoints: new Map([
        ['token', '/token'],
        ['connect', '/account/connect'],

        ['stream' , '/stream/world/{section}'],
        ['livestream', '/livestream/{pid}/{section}'],

        ['conversations', '/conversations'],

        ['people', '/people'],

        ['upload_image', '/upload-image.ashx']
    ]),

    tokenKey: 'token',
};

// GET /api/conversations/v_u0LCEDtHMfoPLEIfsJPQ/receipt HTTP/1.1
// 1

// POST /api/conversations/v_u0LCEDtHMfoPLEIfsJPQ/typing HTTP/1.1
//
// GET /api/conversations/v_u0LCEDtHMfoPLEIfsJPQ/status HTTP/1.1
// {"ConversationID":"v_u0LCEDtHMfoPLEIfsJPQ","AllowedToMessage":true}
//
// GET /api/people/v_u0LCEDtHMfoPLEIfsJPQ/name HTTP/1.1
// "Brian Hamachek"

// GET /api/system-messages?type1=8&type2=-1&last=-1&latest=true HTTP/1.1

//socket

// const WebSocket = require('ws');
//
// const ws = new WebSocket('https://www.wnmlive.com/mobile-ws.ashx');
//
// ws.on('open', function open() {
//     console.log('connected');
//     ws.send('token=B20951B47EC54FC899B');
// });
//
// ws.on('message', function incoming(data) {
//     console.log(data);
// });
//
// ws.on('close', function close() {
//     console.log('disconnected');
// });

// {"IsNewMessage":false,"IsNewComment":true,"IsUpdatedUnreadMessageCount":false,"UnreadMessages":0,"UnreadPosts":0,"ConversationID":null}

