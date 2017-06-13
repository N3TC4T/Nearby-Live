import schema from './models'
import { createSelector } from 'reselect';
import { createSelector as ormCreateSelector } from 'redux-orm';


export const ormSelector = state => state.systemNotifications;

export const systemNotificationsSelector = createSelector(
    ormSelector,
    ormCreateSelector(schema, session => {
        return session.Notification.all().orderBy(['date'], 'desc').toRefArray();
    })
);
