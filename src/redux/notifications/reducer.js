import schema from "./models";

/**
 * Notifications Reducer
 */

// Set initial state
const initialState = schema.getEmptyState();

export default function notificationsReducer(state = initialState, action) {
    switch (action.type) {

        case 'NOTIFICATIONS_UPDATE': {
            const session = schema.session(state);
            const { Notification } = session;

            if (action.data && typeof action.data === 'object') {
                action.data.map(
                    row => {
                        // check if notification not exist then create
                        if (Notification.hasId(row.id)) {
                            Notification.withId(row.id).update(row);
                        }else {
                            Notification.create(row)
                        }
                    }
                );
            }

            return session.state;
        }

        default:
            return state;
    }
}
