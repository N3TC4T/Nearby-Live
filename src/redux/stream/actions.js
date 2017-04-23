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


export function getPosts(sectionIndex , startFrom) {
    return (dispatch) => {

        let section = 'Recent'

        switch (sectionIndex) {
            case 0 :
                section='Recent'
                break
            case 1 :
                section = 'Following'
                break
            case 2 :
                section = 'Hot'
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

export function likePost(postID, ownerId) {
    return (dispatch) => {
        dispatch({
            type: 'POST_LIKE',
            id:postID
        });
        return AppAPI.livestream.post({ pid:postID , section: 'props', owner:ownerId})
    };
}


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




