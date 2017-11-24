/**
 * App Navigation
 */
import React from 'react';
import {Actions, Scene, ActionConst} from 'react-native-router-flux';

// Consts and Libs
import {AppConfig} from '@constants/';

// Containers
import AppLaunch from '@containers/launch/LaunchContainer';

// Scenes
import AuthScenes from './auth';
import TabsScenes from './tabs';
import SubScenes from './sub-scenes';

/* Routes ==================================================================== */
const route = () => (
    <Scene key='root' {...AppConfig.navbarProps}>
        <Scene
            hideNavBar
            key='splash'
            component={AppLaunch}
            analyticsDesc='AppLaunch: Launching App'
        />

        {/* Auth */}
        {AuthScenes}

        {/* Main App */}
        <Scene key='app' {...AppConfig.navbarProps} hideNavBar type={ActionConst.RESET}>
            {/* Tabbar */}
            {TabsScenes}

            {/* Sub-Scenes */}
            {SubScenes}
        </Scene>

    </Scene>
);

export default Actions.create(route());
