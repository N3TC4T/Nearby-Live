/**
 * Auth Scenes
 */
import React from 'react';
import {Scene, ActionConst} from 'react-native-router-flux';

// Consts and Libs
import {AppConfig} from '@constants/';

// Scenes
import Authenticate from '@containers/auth/AuthenticateContainer';
import AuthWebView from '@containers/auth/WebView';

/* Routes ==================================================================== */
const scenes = (
    <Scene key='authenticate'>
        <Scene
            hideNavBar
            key='authLanding'
            component={Authenticate}
            type={ActionConst.RESET}
            analyticsDesc='Authenticate: Authentication'
        />
        <Scene
            {...AppConfig.navbarProps}
            key='passwordReset'
            title='Password Reset'
            clone
            component={AuthWebView}
            url={AppConfig.urls.resetPassword}
            analyticsDesc='AuthPasswordReset: Password Reset'
        />
    </Scene>
);

export default scenes;
