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

        ['notifications', '/system-messages'],

        ['people', '/people'],

        ['upload_image', '/upload-image.ashx']
    ]),

    tokenKey: 'token',
};


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

