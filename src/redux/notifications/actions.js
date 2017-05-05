/**
 * Notifications Actions
 */

import AppAPI from '@lib/api';


export function getNotifications(startFrom) {
    return (dispatch) => {
        let latest = false

        startFrom == -1 ? latest = true: null

        return AppAPI.notifications.get({last: startFrom, latest: latest})
            .then((res) => {
                dispatch({
                    type: 'NOTIFICATIONS_UPDATE',
                    data: res,
                });

            })
    };
}



