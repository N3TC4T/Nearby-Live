/**
 * Launch Screen
 *  - Shows a nice loading screen whilst:
 *  - Checking if user is logged in, and redirects from there
 *  - if logged in connect to websocket
 */
import React, { Component, PropTypes } from 'react';
import {
    View,
    Image,
    StatusBar,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';

import WebSocket from 'reconnecting-websocket';

import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppStyles, AppSizes } from '@theme/';
import { Text, Spacer } from '@ui/'

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    launchImage: {
        width: AppSizes.screen.width,
        height: AppSizes.screen.height,
    },
    loadingText:{
        color:'#fff'
    }
});

/* Component ==================================================================== */
class AppLaunch extends Component {
    static componentName = 'AppLaunch';

    static propTypes = {
        login: PropTypes.func.isRequired,
    };


    connectToWebSocket = async (token) => {
        const ws = new WebSocket('wss://www.wnmlive.com/mobile-ws.ashx');

        ws.addEventListener('open', () => {
            ws.send(`token=${token}`);
        });

        ws.addEventListener('message', (event) => {
            console.log(event.data);
        });

    }

    componentDidMount () {
        // Show status bar on app launch
        StatusBar.setHidden(false, true);

        // Try to authenticate based on existing token
        this.props.login()
        // Logged in, show index screen
            .then((token) => {
                Actions.app({ type: 'reset' })
                // connect to websocket
                this.connectToWebSocket(token)
            })
            // Not Logged in, show Login screen
            .catch(() => Actions.authenticate({ type: 'reset' }));
    }

    render = () => (
        <View style={[AppStyles.container,  AppStyles.containerCentered]}>
            <ActivityIndicator
                animating
                size={'large'}
                color={'#C1C5C8'}
            />
            <Spacer size={20}/>
            <Text style={[styles.loadingText]} h2>Loading...</Text>
        </View>
    );
}

/* Export Component ==================================================================== */
export default AppLaunch;
