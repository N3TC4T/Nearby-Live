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
        ['oauth', '/external/token'],
        ['connect', '/account/connect'],

        ['stream' , '/stream/world/{section}'],
        ['livestream', '/livestream/{pid}/{section}'],

        ['conversations', '/conversations'],

        ['notifications', '/system-messages'],

        ['people', '/people'],
        ['people_info', '/people/{pid}/{section}'],

        ['upload_image', '/upload-image.ashx']
    ]),

    tokenKey: 'token',
};