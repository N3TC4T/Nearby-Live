import React from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    View,
    ViewPropTypes
} from 'react-native';

import moment from 'moment/min/moment-with-locales.min';

const containerStyle = {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5
};

const textStyle = {
    fontSize: 10,
    backgroundColor: 'transparent',
    textAlign: 'right'
};

const styles = {
    left: StyleSheet.create({
        container: {
            ...containerStyle
        },
        text: {
            color: '#aaa',
            ...textStyle
        }
    }),
    right: StyleSheet.create({
        container: {
            ...containerStyle
        },
        text: {
            color: '#fff',
            ...textStyle
        }
    })
};

// Todo: Fix me
// eslint-disable-next-line
export default class Time extends React.Component {
    render() {
        return (
            <View style={[styles[this.props.position].container,
                this.props.containerStyle[this.props.position]]}>
                <Text style={[styles[this.props.position].text,
                    this.props.textStyle[this.props.position]]}>
                    {moment(this.props.currentMessage.date).locale(this.context.getLocale()).format('LT')}
                </Text>
            </View>
        );
    }
}

Time.contextTypes = {
    getLocale: PropTypes.func
};

Time.defaultProps = {
    position: 'left',
    currentMessage: {
        date: null
    },
    containerStyle: {},
    textStyle: {}
};

Time.propTypes = {
    position: PropTypes.oneOf(['left', 'right']),
    currentMessage: PropTypes.object,
    containerStyle: PropTypes.shape({
        left: ViewPropTypes.style,
        right: ViewPropTypes.style
    }),
    textStyle: PropTypes.shape({
        left: Text.propTypes.style,
        right: Text.propTypes.style
    })
};
