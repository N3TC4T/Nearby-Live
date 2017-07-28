/**
 * Stream Actions
 */

import AppAPI from '@lib/api';


export function updateSectionIndex(sectionIndex) {
    return (dispatch) => {
        dispatch({
            type: 'SECTION_INDEX_UPDATE',
            section:sectionIndex
        });
    };
}

/* Posts ==================================================================== */

export function getPosts(sectionIndex , startFrom) {
    return (dispatch) => {

        let section = 'Recent';

        switch (sectionIndex) {
            case 0 :
                section='Recent';
                break;
            case 1 :
                section = 'Following';
                break;
            case 2 :
                section = 'Hot';
                break
        }

        return AppAPI.stream.get({ section: section, last: startFrom})
            .then((res) => {
                dispatch({
                    type: 'POSTS_UPDATE',
                    data: res,
                    section:sectionIndex
                });

            })
    };
}

export function getUserPosts(userID , startFrom) {
    return (dispatch) => {
        return AppAPI.people_info.get({ pid: userID, section:'posts',last: startFrom})
            .then((res) => {
                dispatch({
                    type: 'POSTS_UPDATE',
                    data: res,
                    section:3
                });

            })
    };
}


export function likePost(postID, ownerId) {
    return (dispatch) => {
        dispatch({
            type: 'POST_LIKE',
            id:postID
        });
        return AppAPI.livestream.post({ pid:postID , section: 'props', owner:ownerId})
    };
}


export function featurePost(postID) {
    return (dispatch) => {
        return AppAPI.livestream.post({ pid:postID , section: 'feature'})
            .then((res) => {
                dispatch({
                    type: 'POST_FEATURE',
                    id:postID
                });
            })
    };
}

export function watchPost(postID) {
    return (dispatch) => {
        dispatch({
            type: 'POST_WATCH',
            id:postID
        });
        return AppAPI.livestream.get({ pid:postID , section: 'watch'})
    };
}

export function unwatchPost(postID) {
    return (dispatch) => {
        dispatch({
            type: 'POST_UNWATCH',
            id:postID
        });
        return AppAPI.livestream.get({ pid:postID , section: 'unwatch'})
    };
}

export function deletePost(postID) {
    return (dispatch) => {
        dispatch({
            type: 'POST_DELETE',
            id:postID
        });
        return AppAPI.livestream.post({ pid:postID , section: 'delete'})
    };
}

export function reportPost(postID) {
    return (dispatch) => {
        dispatch({
            type: 'POST_REPORT',
            id:postID
        });
        return AppAPI.livestream.get({ pid:postID , section: 'report'})
    };
}


/* Comments ==================================================================== */

export function getComments(postID) {
    return (dispatch) => {
        return AppAPI.livestream.get({pid: postID, section: 'comments'})
            .then((res) => {
                dispatch({
                    type: 'COMMENTS_UPDATE',
                    data: res,
                    id: postID
                });
            })
    };

}


export function leaveComment(postID, comment) {
    return (dispatch) => {
        // for for better user experience first we show comment as sending and then sent http request
        dispatch({
            type: 'COMMENTS_ADD',
            data: comment,
            id: postID
        });
        // sending http request and then set message as sent
        return AppAPI.livestream.post({  pid: postID, section: 'comments' }, comment.txt)
    };
}




