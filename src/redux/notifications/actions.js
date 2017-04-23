/**
 * Notification Actions
 */

import { AsyncStorage } from "react-native";


import AppAPI from "@lib/api";
import { APIConfig } from "@constants/";


export function eventHandler(data) {
    return (dispatch) => {

                dispatch({
                    type: 'CONVERSATIONS_REPLACE',
                    data: res,
                });

    };
}