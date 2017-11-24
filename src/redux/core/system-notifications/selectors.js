import {createSelector} from 'reselect';
import {createSelector as ormCreateSelector} from 'redux-orm';
import schema from './models';

export const ormSelector = state => state.systemNotifications;

export const systemNotificationsSelector = createSelector(
    ormSelector,
    ormCreateSelector(schema, session => session.Notification.all().orderBy(['date'], 'desc').toRefArray()),
);
