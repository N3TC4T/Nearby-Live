/**
 * Notifications Container
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

// Actions
import * as SystemNotificationsActions from '@redux/core/system-notifications/actions';

// Selectors
import { systemNotificationsSelector } from '@redux/core/system-notifications/selectors';

import SystemNotificationsListingRender from './SystemNotificationsView';

/* Redux ==================================================================== */
const mapStateToProps = state => ({
    user: state.user,
    systemNotificationsListing: systemNotificationsSelector(state),
});

// Any actions to map to the component?
const mapDispatchToProps = {
    getSystemNotifications: SystemNotificationsActions.getSystemNotifications,
}

export default connect(mapStateToProps, mapDispatchToProps)(SystemNotificationsListingRender);
