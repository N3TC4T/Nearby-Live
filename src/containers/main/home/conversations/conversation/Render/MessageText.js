import React from 'react';
import PropTypes from 'prop-types';
import {
    Linking,
    StyleSheet,
    Text,
    View,
    ViewPropTypes
} from 'react-native';

import ParsedText from 'react-native-parsed-text';

const textStyle = {
    fontSize: 16,
    lineHeight: 20,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10
};

const styles = {
    left: StyleSheet.create({
        container: {
        },
        text: {
            color: 'black',
            ...textStyle
        },
        link: {
            color: 'black',
            textDecorationLine: 'underline'
        }
    }),
    right: StyleSheet.create({
        container: {
        },
        text: {
            color: 'white',
            ...textStyle
        },
        link: {
            color: 'white',
            textDecorationLine: 'underline'
        }
    })
};

export default class MessageText extends React.Component {
    static onUrlPress(url) {
        Linking.openURL(url);
    }

    constructor(props) {
        super(props);
        this.onUrlPress = this.onUrlPress.bind(this);
        this.onEmailPress = this.onEmailPress.bind(this);
    }

    render() {
        return (
            <View style={[styles[this.props.position].container,
                this.props.containerStyle[this.props.position]
            ]}>
                <ParsedText
                    style={[styles[this.props.position].text,
                        this.props.textStyle[this.props.position]
                    ]}
                    parse={[
                        {
                            type: 'url',
                            style: StyleSheet.flatten([styles[this.props.position].link,
                                this.props.linkStyle[this.props.position]]),
                            onPress: this.onUrlPress
                        },
                        {
                            type: 'email',
                            style: StyleSheet.flatten([styles[this.props.position].link,
                                this.props.linkStyle[this.props.position]]),
                            onPress: this.onEmailPress
                        }
                    ]}>

                    {this.props.currentMessage.body.includes('[PHOTO-MSG]') ? null : this.props.currentMessage.body}
                </ParsedText>
            </View>
        );
    }
}

MessageText.contextTypes = {
    actionSheet: PropTypes.func
};

MessageText.defaultProps = {
    position: 'left',
    currentMessage: {
        text: ''
    },
    containerStyle: {},
    textStyle: {},
    linkStyle: {}
};

MessageText.propTypes = {
    position: PropTypes.oneOf(['left', 'right']),
    currentMessage: PropTypes.object,
    containerStyle: PropTypes.shape({
        left: ViewPropTypes.style,
        right: ViewPropTypes.style
    }),
    textStyle: PropTypes.shape({
        left: Text.propTypes.style,
        right: Text.propTypes.style
    }),
    linkStyle: PropTypes.shape({
        left: Text.propTypes.style,
        right: Text.propTypes.style
    })
};
