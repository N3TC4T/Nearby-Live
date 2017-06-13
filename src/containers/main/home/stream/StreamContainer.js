/**
 * Stream Container
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

// Actions
import * as StreamActions from '@redux/core/stream/actions';

// Selectors
import { streamSelector } from '@redux/core/stream/selectors';

import PostsListingRender from './StreamView';

/* Redux ==================================================================== */
const mapStateToProps = state => ({
    user: state.user,
    postsListing: streamSelector(state),
});

// Any actions to map to the component?
const mapDispatchToProps = {
    getPosts: StreamActions.getPosts,
    likePost: StreamActions.likePost,
    watchPost: StreamActions.watchPost,
    unwatchPost: StreamActions.unwatchPost,
    featurePost: StreamActions.featurePost,
    deletePost: StreamActions.deletePost,
    reportPost: StreamActions.reportPost,
    updateSectionIndex:StreamActions.updateSectionIndex,
}

export default connect(mapStateToProps, mapDispatchToProps)(PostsListingRender);
