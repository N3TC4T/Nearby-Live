/**
 * List of Comments for a Post
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

// Actions
import * as StreamActions from '@redux/core/stream/actions';

// selector
import { postSelector } from "@redux/core/stream/selectors";

// Consts and Libs
import { ErrorMessages } from '@constants/';

import CommentsListingRender from './CommentsView';

/* Redux ==================================================================== */

const mapStateToProps = (state, ownProps) => ({
    user: state.user,
    post: postSelector(state, ownProps),
});

const mapDispatchToProps = {
    getComments: StreamActions.getComments,
    leaveComment: StreamActions.leaveComment,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    user:stateProps.user,
    post: stateProps.post,
    getComments: (params) => dispatchProps.getComments(ownProps.postID),
    leaveComment: dispatchProps.leaveComment,
});


export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(CommentsListingRender);
