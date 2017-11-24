import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, ViewPropTypes} from 'react-native';
import AvatarRender from './AvatarRender';
import {isSameUser, isSameDay} from './utils';

const styles = {
    left: StyleSheet.create({
        container: {
            marginRight: 8
        },
        onTop: {
            alignSelf: 'flex-start'
        },
        onBottom: {},
        image: {
            height: 36,
            width: 36,
            borderRadius: 18
        }
    }),
    right: StyleSheet.create({
        container: {
            marginLeft: 8
        },
        onTop: {
            alignSelf: 'flex-start'
        },
        onBottom: {},
        image: {
            height: 36,
            width: 36,
            borderRadius: 18
        }
    })
};

export default class Avatar extends React.Component {
    renderAvatar() {
        return (
            <AvatarRender
                avatarStyle={StyleSheet.flatten([
                    styles[this.props.position].image,
                    this.props.imageStyle[this.props.position]
                ])}
                user={this.props.user}
            />
        );
    }

    render() {
        const {renderAvatarOnTop} = this.props;

        const messageToCompare = renderAvatarOnTop ? this.props.previousMessage : this.props.nextMessage;
        const computedStyle = renderAvatarOnTop ? 'onTop' : 'onBottom';


        if (isSameUser(this.props.currentMessage, messageToCompare) && isSameDay(this.props.currentMessage, messageToCompare)) {
            return (
                <View style={[
                    styles[this.props.position].container,
                    this.props.containerStyle[this.props.position]
                ]}>
                    <AvatarRender
                        avatarStyle={StyleSheet.flatten([
                            styles[this.props.position].image,
                            this.props.imageStyle[this.props.position]
                        ])}
                    />
                </View>
            );
        }
        return (
            <View
                style={[
                    styles[this.props.position].container,
                    styles[this.props.position][computedStyle],
                    this.props.containerStyle[this.props.position]]}>
                {this.renderAvatar()}
            </View>
        );
    }
}

Avatar.defaultProps = {
    renderAvatarOnTop: false,
    position: 'left',
    currentMessage: {
        user: null
    },
    nextMessage: {},
    previousMessage: {},
    containerStyle: {},
    imageStyle: {}
};

Avatar.propTypes = {
    user: PropTypes.object.isRequired,
    renderAvatarOnTop: PropTypes.bool,
    position: PropTypes.oneOf(['left', 'right']),
    currentMessage: PropTypes.object,
    nextMessage: PropTypes.object,
    previousMessage: PropTypes.object,
    containerStyle: PropTypes.shape({
        left: ViewPropTypes.style,
        right: ViewPropTypes.style
    }),
    imageStyle: PropTypes.shape({
        left: ViewPropTypes.style,
        right: ViewPropTypes.style
    })
};
