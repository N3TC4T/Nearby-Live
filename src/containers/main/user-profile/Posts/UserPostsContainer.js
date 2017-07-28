/**
 * Stream Container
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

// Actions
import * as StreamActions from '@redux/core/stream/actions';

// Selectors
import { userPostsSelector } from '@redux/core/stream/selectors';

import PostsListingRender from './UserPostsView';

/* Redux ==================================================================== */
const mapStateToProps = (state, ownProps) => ({
    user: state.user,
    postsListing: userPostsSelector(state, ownProps),
});

// Any actions to map to the component?
const mapDispatchToProps = {
    getUserPosts: StreamActions.getUserPosts,
    likePost: StreamActions.likePost,
    watchPost: StreamActions.watchPost,
    unwatchPost: StreamActions.unwatchPost,
    featurePost: StreamActions.featurePost,
    deletePost: StreamActions.deletePost,
    reportPost: StreamActions.reportPost,
}

export default connect(mapStateToProps, mapDispatchToProps)(PostsListingRender);