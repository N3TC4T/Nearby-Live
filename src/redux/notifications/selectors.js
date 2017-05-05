import schema from './models'
import { createSelector } from 'reselect';
import { createSelector as ormCreateSelector } from 'redux-orm';


export const ormSelector = state => state.notifications;

export const notificationsSelector = createSelector(
    ormSelector,
    ormCreateSelector(schema, session => {
        return session.Notification.all().orderBy(['date'], 'desc').toRefArray();
    })
);
