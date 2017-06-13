import React, { Component } from 'react';
import  {
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
    View
} from 'react-native';

// Consts and Libs
import { AppStyles } from '@theme/';

// Components
import { Icon } from '@components/ui';

export default class Search extends Component {
    constructor(){
        super()
        this.state = {
            text: ''
        }
    }
    render(){
        const {placeHolder, backgroundColor, innerBackground, border, radius, onSubmitEditing, onChangeText} = this.props;
        return(
            <View style={[AppStyles.row, AppStyles.paddingLeftSml , {backgroundColor: backgroundColor}]}>
                <View style={[AppStyles.flex1, AppStyles.centerAligned]}>
                    <Icon color='grey' name={"ios-search"} type={"ionicon"} />
                </View>
                <View style={AppStyles.flex6}>
                    <TextInput
                        style={[styles.input, {backgroundColor:innerBackground, borderRadius: radius, borderWidth: border ? 1 : 0}]}
                        onChangeText={(text) => { this.setState({text}); onChangeText(text)}}
                        value={this.state.text}
                        placeholder={placeHolder}
                        placeholderTextColor={'#9197A3'}
                        underlineColorAndroid='rgba(0,0,0,0)'
                    />
                </View>
            </View>
        )
    }
}
Search.defaultProps = {
    placeHolder: 'Search messages',
    backgroundColor: '#FFFFFF',
    //backgroundColor: primary,
    innerBackground: '#FFFFFF',
    radius: 5,
    border: false,
}
Search.propTypes = {
    placeHolder: React.PropTypes.string,
    backgroundColor: React.PropTypes.string,
    innerBackground: React.PropTypes.string,
    radius: React.PropTypes.number,
    borderColor: React.PropTypes.string,
    border: React.PropTypes.bool,
    iconColor:  React.PropTypes.string,
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        paddingHorizontal: 10,
        paddingRight: 30,
    }
});
