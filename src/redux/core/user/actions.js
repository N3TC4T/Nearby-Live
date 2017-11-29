/**
 * User Actions
 */

import {AsyncStorage} from 'react-native';

import AppAPI from '@lib/api';
import {APIConfig} from '@constants/';

// check if there is any token or user logged in
export function getLoginStatus() {
    // Todo: Fix me
    // eslint-disable-next-line no-unused-vars
    return dispatch => new Promise(async(resolve, reject) => {
        let apiToken;

        if (AppAPI.getToken) {apiToken = await AppAPI.getToken();}
        if (apiToken) {
            return resolve(apiToken);
        }
        return reject();
    });
}

/**
 * Login to Nearby with email and password and receive Token
 */
export function emailLogin(credentials, freshLogin) {
    // eslint-disable-next-line
    return dispatch => new Promise(async(resolve, reject) => {
        const userCredentials = credentials || null;

        // Force logout, before logging in
        if (freshLogin && AppAPI.deleteToken) {await AppAPI.deleteToken();}

        if (userCredentials) {
            AppAPI[APIConfig.tokenKey].get({
                email: userCredentials.email,
                password: userCredentials.password,
                lat: 0,
                long: 0
            }).then(async(res) => {
                if (res.length < 1 || !res.length) {
                    return reject(new Error('Invalid Email and/or Password!'));
                }

                // Save new Credentials to AsyncStorage
                await AsyncStorage.setItem('api/credentials', userCredentials.email);

                // Set token in AsyncStorage + memory
                await AsyncStorage.setItem('api/token', res);

                // Get user details from API, using user token
                return AppAPI.connect.get()
                    .then(async(userData) => {
                        dispatch({
                            type: 'USER_REPLACE',
                            data: userData
                        });
                        return resolve(userData);
                    }).catch(err => reject(err));
            }).catch(err => reject(err));
        } else {
            return reject();
        }


    });
}

/**
 * Login to Nearby with facebook accessToken
 */
export function facebookLogin(accessToken, freshLogin) {
    return dispatch => new Promise(async(resolve, reject) => {
        // Force logout, before logging in
        if (freshLogin && AppAPI.deleteToken) {await AppAPI.deleteToken();}

        if (accessToken) {
            AppAPI.oauth.post({
                token: accessToken,
                enhanced: true,
                provider: 2,
                lat: 0,
                long: 0
            }).then(async(res) => {
                if (!res.IsSuccess) {
                    return reject(new Error('Cant login with facebook right now!'));
                }

                // Set token in AsyncStorage + memory
                await AsyncStorage.setItem('api/token', res.Token);

                // Get user details from API, using user token
                return AppAPI.connect.get()
                    .then(async(userData) => {
                        dispatch({
                            type: 'USER_REPLACE',
                            data: userData
                        });
                        return resolve(userData);
                    }).catch(err => reject(err));
            }).catch(err => reject(err));
        } else {
            return reject();
        }

        return reject();
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
                data: {}
            });
        });
}
