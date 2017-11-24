import schema from './models';

/**
 * System Notifications Reducer
 */

// Set initial state
const initialState = {...schema.getEmptyState(), UnreadCount: 0};

export default function notificationsReducer(state = initialState, action) {
    switch (action.type) {
        case 'SYSTEM_NOTIFICATIONS_UPDATE': {
            const session = schema.session(state);
            const {Notification} = session;

            if (action.data && typeof action.data === 'object') {
                action.data.map((row) => {
                // check if notification not exist then create
                    if (Notification.hasId(row.id)) {
                        Notification.withId(row.id).update(row);
                    } else {
                        Notification.create(row);
                    }

                    return null;
                });
            }

            return session.state;
        }
        case 'SYSTEM_NOTIFICATIONS_UNREAD_COUNT_UPDATE': {
            if (typeof action.data === 'number') {
                return {
                    ...state,
                    UnreadCount: action.data
                };
            }

            return state;
        }

        default:
            return state;
    }
}
