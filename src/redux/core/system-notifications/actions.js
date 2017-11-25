/**
 * Notifications Actions
 */

import AppAPI from '@lib/api';

export function getSystemNotifications(startFrom) {
    return (dispatch) => {
        let latest = false;

        if (startFrom === -1) {
            latest = true;
        }

        return AppAPI.notifications.get({last: startFrom, latest})
            .then((res) => {
                dispatch({
                    type: 'SYSTEM_NOTIFICATIONS_UPDATE',
                    data: res
                });
            });
    };
}

