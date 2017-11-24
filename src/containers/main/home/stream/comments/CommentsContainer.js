/**
 * List of Comments for a Post
 */
import {connect} from 'react-redux';

// Actions
import * as StreamActions from '@redux/core/stream/actions';

// selector
import {postSelector} from '@redux/core/stream/selectors';

import CommentsListingRender from './CommentsView';

/* Redux ==================================================================== */

const mapStateToProps = (state, ownProps) => ({
    user: state.user,
    post: postSelector(state, ownProps)
});

const mapDispatchToProps = {
    getComments: StreamActions.getComments,
    leaveComment: StreamActions.leaveComment
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    user: stateProps.user,
    post: stateProps.post,
    getComments: dispatchProps.getComments(ownProps.postID),
    leaveComment: dispatchProps.leaveComment
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(CommentsListingRender);
