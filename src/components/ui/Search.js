import React, {Component} from 'react';
import {
    StyleSheet,
    TextInput,
    View
} from 'react-native';
import PropTypes from 'prop-types';

// Consts and Libs
import {AppStyles} from '@theme/';

// Components
import {Icon} from '@components/ui';

export default class Search extends Component {
    constructor() {
        super();
        this.state = {
            text: ''
        };
    }
    render() {
        const {
            placeHolder, backgroundColor, innerBackground, border, radius, onChangeText
        } = this.props;
        return (
            <View style={[AppStyles.row, AppStyles.paddingLeftSml, {backgroundColor}]}>
                <View style={[AppStyles.flex1, AppStyles.centerAligned]}>
                    <Icon color='grey' name='ios-search' type='ionicon' />
                </View>
                <View style={AppStyles.flex6}>
                    <TextInput
                        style={[styles.input, {backgroundColor: innerBackground, borderRadius: radius, borderWidth: border ? 1 : 0}]}
                        onChangeText={(text) => { this.setState({text}); onChangeText(text); }}
                        value={this.state.text}
                        placeholder={placeHolder}
                        placeholderTextColor='#9197A3'
                        underlineColorAndroid='rgba(0,0,0,0)'
                    />
                </View>
            </View>
        );
    }
}
Search.defaultProps = {
    placeHolder: 'Search messages',
    backgroundColor: '#FFFFFF',
    // backgroundColor: primary,
    innerBackground: '#FFFFFF',
    radius: 5,
    border: false,
    onChangeText: null
};
Search.propTypes = {
    onChangeText: PropTypes.func,
    placeHolder: PropTypes.string,
    backgroundColor: PropTypes.string,
    innerBackground: PropTypes.string,
    radius: PropTypes.number,
    borderColor: PropTypes.string,
    border: PropTypes.bool,
    iconColor: PropTypes.string
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        paddingHorizontal: 10,
        paddingRight: 30
    }
});
