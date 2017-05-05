/**
 * Notifications Container
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

// Actions
import * as NotificationsActions from '@redux/notifications/actions';

// Selectors
import { notificationsSelector } from '@redux/notifications/selectors';

import NotificationsListingRender from './NotificationsView';

/* Redux ==================================================================== */
const mapStateToProps = state => ({
    user: state.user,
    notificationsListing: notificationsSelector(state),
});

// Any actions to map to the component?
const mapDispatchToProps = {
    getNotifications: NotificationsActions.getNotifications,
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsListingRender);
