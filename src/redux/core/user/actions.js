/**
 * User Actions
 */

import { AsyncStorage } from "react-native";


import AppAPI from "@lib/api";
import { APIConfig } from "@constants/";

/**
 * Login to Nearby and receive Token
 */
export function login(credentials, freshLogin) {
    return dispatch => new Promise(async (resolve, reject) => {
        const userCreds = credentials || null;

        // Force logout, before logging in
        if (freshLogin && AppAPI.deleteToken) await AppAPI.deleteToken();

        let apiToken;

        if (userCreds) {
            AppAPI[APIConfig.tokenKey].get({
                email: userCreds.email,
                password: userCreds.password,
                lat:0,
                long:0,
            }).then(async(res) => {
                if (res.length < 1 || !res.length) {
                    return reject('Invalid Email and/or Password!');
                }

                // Save new Credentials to AsyncStorage
                await AsyncStorage.setItem('api/credentials', userCreds.email);

                // Set token in AsyncStorage + memory
                await AsyncStorage.setItem('api/token', res);


                // Get user details from API, using user token
                return AppAPI.connect.get()
                    .then(async(userData) => {
                        dispatch({
                            type: 'USER_REPLACE',
                            data: userData,
                        });
                        return resolve(userData);
                    }).catch(err => reject(err));

            }).catch(err => reject(err));
        } else {
            if (AppAPI.getToken) apiToken = await AppAPI.getToken();
            if (apiToken){
                return resolve(apiToken);
            }
            else
                return reject();
        }
    });
}


/**
 * Logout
 */
export function logout() {
    return dispatch => AppAPI.deleteToken()
        .then(() => {
            dispatch({
                type: 'USER_REPLACE',
                data: {},
            });
        });
}

/**
 * Get My User Data
 */
export function getMe() {
    return dispatch => AppAPI.me.get()
        .then((userData) => {
            dispatch({
                type: 'USER_REPLACE',
                data: userData,
            });

            return userData;
        });
}

/**
 * Update My User Data
 * - Receives complete user data in return
 */
export function updateMe(payload) {
    return dispatch => AppAPI.me.post(payload)
        .then((userData) => {
            dispatch({
                type: 'USER_REPLACE',
                data: userData,
            });

            return userData;
        });
}
