/**
 * Stream Container
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

// Actions
import * as StreamActions from '@redux/stream/actions';

// Selectors
import { streamSelector } from '@redux/stream/selectors';

import PostsListingRender from './StreamView';

/* Redux ==================================================================== */
const mapStateToProps = state => ({
    postsListing: streamSelector(state),
});

// Any actions to map to the component?
const mapDispatchToProps = {
    getPosts: StreamActions.getPosts,
    likePost: StreamActions.likePost,
    updateSectionIndex:StreamActions.updateSectionIndex,
}

export default connect(mapStateToProps, mapDispatchToProps)(PostsListingRender);
