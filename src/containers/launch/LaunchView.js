/**
 * Launch Screen
 *  - Shows a nice loading screen whilst:
 *  - Checking if user is logged in, and redirects from there
 *  - if logged in connect to websocket
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    View,
    Image,
    StatusBar,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';

import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppStyles, AppSizes } from '@theme/';
import { Text, Spacer } from '@ui/'

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    logo: {
        width: AppSizes.screen.width * 0.55,
        resizeMode: 'contain',
    },
    loadingText:{
        color:'#fff'
    }
});

/* Component ==================================================================== */
class AppLaunch extends Component {
    static componentName = 'AppLaunch';

    static propTypes = {
        getLoginStatus: PropTypes.func.isRequired,
    };


    componentDidMount () {
        // Show status bar on app launch
        StatusBar.setHidden(false, true);

        // Try to authenticate based on existing token
        this.props.getLoginStatus()
        // Logged in, show index screen
            .then((token) => {
                Actions.app({ type: 'reset' })
                // connect to websocket
                Actions.app({ type: 'CONNECT' , token:token})
            })
            // Not Logged in, show Login screen
            .catch(() => Actions.authenticate({ type: 'reset' }));
    }

    render = () => (
        <View style={[AppStyles.container,  AppStyles.containerCentered, {backgroundColor:'#232F3A'}]}>
            <View style={[AppStyles.row, AppStyles.paddingHorizontal]}>
                <View style={[AppStyles.flex1, AppStyles.containerCentered]}>
                    <Image
                        source={require('../../assets/image/logo.png')}
                        style={[styles.logo]}
                    />
                </View>
            </View>
        </View>
    );
}

/* Export Component ==================================================================== */
export default AppLaunch;
