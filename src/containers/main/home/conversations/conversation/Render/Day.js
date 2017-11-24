import React from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    View,
    ViewPropTypes
} from 'react-native';

import moment from 'moment/min/moment-with-locales.min';

import {isSameDay} from './utils';

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
        marginBottom: 10
    },
    wrapper: {
        // backgroundColor: '#ccc',
        // borderRadius: 10,
        // paddingLeft: 10,
        // paddingRight: 10,
        // paddingTop: 5,
        // paddingBottom: 5,
    },
    text: {
        backgroundColor: 'transparent',
        color: '#b2b2b2',
        fontSize: 12,
        fontWeight: '600'
    }
});

// Todo: Fix me
// eslint-disable-next-line
export default class Day extends React.Component {
    render() {
        if (!isSameDay(this.props.currentMessage, this.props.previousMessage)) {
            return (
                <View style={[styles.container, this.props.containerStyle]}>
                    <View style={[styles.wrapper, this.props.wrapperStyle]}>
                        <Text style={[styles.text, this.props.textStyle]}>
                            {moment(this.props.currentMessage.date).locale(this.context.getLocale()).format('ll').toUpperCase()}
                        </Text>
                    </View>
                </View>
            );
        }
        return null;
    }
}

Day.contextTypes = {
    getLocale: PropTypes.func
};

Day.defaultProps = {
    currentMessage: {
    // TODO test if crash when date === null
        date: null
    },
    previousMessage: {},
    containerStyle: {},
    wrapperStyle: {},
    textStyle: {}
};

Day.propTypes = {
    currentMessage: PropTypes.object,
    previousMessage: PropTypes.object,
    containerStyle: ViewPropTypes.style,
    wrapperStyle: ViewPropTypes.style,
    textStyle: Text.propTypes.style
};
