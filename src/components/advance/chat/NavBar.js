import React, {
    PropTypes,
} from 'react';
import {
    Platform,
    Animated,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Actions } from 'react-native-router-flux';

// const and libs
import { AppSizes, AppStyles } from '@theme/'
import AppAPI from '@lib/api';
import _drawerImage from './menu_burger.png';
import _backButtonImage from './back_chevron.png';

// components
import Icon from 'react-native-vector-icons/Octicons';


const styles = StyleSheet.create({
    title: {
        textAlign: 'left',
        color: '#ffffff',
        fontSize: 15,
        width: 180,
        alignSelf: 'center',
    },
    statusText :{
        textAlign: 'left',
        color: '#ffffff',
        fontSize: 10,
    },
    titleWrapper: {
        marginTop: 5,
        position: 'absolute',
        ...Platform.select({
            ios: {
                top: 20,
            },
            android: {
                top: 5,
            },
        }),
        left: 60,
    },
    header: {
        backgroundColor: '#EFEFF2',
        paddingTop: 0,
        top: 0,
        ...Platform.select({
            ios: {
                height: 64,
            },
            android: {
                height: 54,
            },
        }),
        right: 0,
        left: 0,
        borderBottomWidth: 0.5,
        borderBottomColor: '#828287',
        position: 'absolute',
    },
    backButton: {
        height: 37,
        position: 'absolute',
        ...Platform.select({
            ios: {
                top: 22,
            },
            android: {
                top: 10,
            },
        }),
        left: 2,
        padding: 8,
        flexDirection: 'row',
    },
    rightButton: {
        height: 37,
        position: 'absolute',
        ...Platform.select({
            ios: {
                top: 22,
            },
            android: {
                top: 10,
            },
        }),
        right: 2,
        padding: 8,
    },
    leftButton: {
        height: 37,
        position: 'absolute',
        ...Platform.select({
            ios: {
                top: 20,
            },
            android: {
                top: 8,
            },
        }),
        left: 2,
        padding: 8,
    },
    barRightButtonText: {
        color: 'rgb(0, 122, 255)',
        textAlign: 'right',
        fontSize: 17,
    },
    barBackButtonText: {
        color: 'rgb(0, 122, 255)',
        textAlign: 'left',
        fontSize: 17,
        paddingLeft: 6,
    },
    barLeftButtonText: {
        color: 'rgb(0, 122, 255)',
        textAlign: 'left',
        fontSize: 17,
    },
    backButtonImage: {
        width: 13,
        height: 21,
    },
    defaultImageStyle: {
        height: 24,
        resizeMode: 'contain',
    },
});

const propTypes = {
    initDetails: PropTypes.object,
};

const contextTypes = {
    drawer: PropTypes.object,
};

const defaultProps = {
    drawerImage: _drawerImage,
    backButtonImage: _backButtonImage,
};

class NavBar extends React.Component {

    constructor(props) {
        super(props);

        this.renderRightButton = this.renderRightButton.bind(this);
        this.renderBackButton = this.renderBackButton.bind(this);
        this.renderLeftButton = this.renderLeftButton.bind(this);
        this.renderTitle = this.renderTitle.bind(this);

        this.state = {
            isCheckingOnline:true,
            isOnline:null
        }
    }

    componentDidMount = () => {
        this.getOnlineStatus();

        this._isMounted = true
    }


    componentWillMount() {
        this._isMounted = false;
    }

    getOnlineStatus = () => {

        const { pid } = this.props

        AppAPI.people.post('status', pid)
            .then((res) => {
                if (this._isMounted){
                    this.setState({
                        isCheckingOnline:false,
                        isOnline: !!res[0].IsOnline
                    })
                }
            })
    }

    renderBackButton() {
        const state = this.props.navigationState;

        const style = [
            styles.backButton,
            state.leftButtonStyle,
        ];

        if (state.index === 0 && (!state.parentIndex || state.parentIndex === 0)) {
            return null;
        }

        const buttonImage = this.props.backButtonImage


        return (
            <TouchableOpacity
                testID="backNavButton"
                style={style}
                onPress={Actions.pop}
            >
             { buttonImage &&
                <Image
                source={buttonImage}
                style={[
                  styles.backButtonImage,
                ]}
                />
                }
            </TouchableOpacity>
        );
    }

    renderRightButton(navProps) {
        const self = this;
        function tryRender(state, wrapBy) {
            if (!state) {
                return null;
            }
            const rightTitle = state.getRightTitle ? state.getRightTitle(navProps) : state.rightTitle;

            const textStyle = [styles.barRightButtonText, self.props.rightButtonTextStyle,
                state.rightButtonTextStyle];
            const style = [styles.rightButton, self.props.rightButtonStyle, state.rightButtonStyle];
            if (state.rightButton) {
                let Button = state.rightButton;
                if (wrapBy) {
                    Button = wrapBy(Button);
                }
                return (
                    <Button
                        {...self.props}
                        {...state}
                        key={'rightNavBarBtn'}
                        testID="rightNavButton"
                        style={style}
                        textButtonStyle={textStyle}
                    />
                );
            }
            if (state.onRight && (rightTitle || state.rightButtonImage)) {
                const onPress = state.onRight.bind(null, state);
                return (
                    <TouchableOpacity
                        key={'rightNavBarBtn'}
                        testID="rightNavButton"
                        style={style}
                        onPress={onPress}
                    >
                        {rightTitle &&
                        <Text style={textStyle}>
                            {rightTitle}
                        </Text>
                        }
                        {state.rightButtonImage &&
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                            <Image
                                source={state.rightButtonImage}
                                style={state.rightButtonIconStyle}
                            />
                        </View>
                        }
                    </TouchableOpacity>
                );
            }
            if ((!!state.onRight ^ (typeof (rightTitle) !== 'undefined'
                || typeof (state.rightButtonImage) !== 'undefined'))) {
                console.warn(
                    `Both onRight and rightTitle/rightButtonImage
            must be specified for the scene: ${state.name}`,
                );
            }
            return null;
        }
        return tryRender(this.props.component, this.props.wrapBy) || tryRender(this.props);
    }

    renderLeftButton(navProps) {
        const self = this;
        const drawer = this.context.drawer;
        function tryRender(state, wrapBy) {
            let onPress = state.onLeft;
            let buttonImage = state.leftButtonImage;
            let menuIcon = state.drawerIcon;
            const style = [styles.leftButton, self.props.leftButtonStyle, state.leftButtonStyle];
            const textStyle = [styles.barLeftButtonText, self.props.leftButtonTextStyle,
                state.leftButtonTextStyle];
            const leftButtonStyle = [styles.defaultImageStyle, state.leftButtonIconStyle];
            const leftTitle = state.getLeftTitle ? state.getLeftTitle(navProps) : state.leftTitle;

            if (state.leftButton) {
                let Button = state.leftButton;
                if (wrapBy) {
                    Button = wrapBy(Button);
                }
                return (
                    <Button
                        {...self.props}
                        {...state}
                        key={'leftNavBarBtn'}
                        testID="leftNavButton"
                        style={style}
                        textStyle={textStyle}
                    />
                );
            }

            if (!onPress && !!drawer && typeof drawer.toggle === 'function') {
                buttonImage = state.drawerImage;
                if (buttonImage || menuIcon) {
                    onPress = drawer.toggle;
                }
                if (!menuIcon) {
                    menuIcon = (
                        <Image
                            source={buttonImage}
                            style={leftButtonStyle}
                        />
                    );
                }
            }

            if (onPress && (leftTitle || buttonImage)) {
                onPress = onPress.bind(null, state);
                return (
                    <TouchableOpacity
                        key={'leftNavBarBtn'}
                        testID="leftNavButton"
                        style={style}
                        onPress={onPress}
                    >
                        {leftTitle &&
                        <Text style={textStyle}>
                            {leftTitle}
                        </Text>
                        }
                        {buttonImage &&
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                            {menuIcon || <Image
                                source={buttonImage}
                                style={state.leftButtonIconStyle || styles.defaultImageStyle}
                            />
                            }
                        </View>
                        }
                    </TouchableOpacity>
                );
            }
            if ((!!state.onLeft ^ !!(leftTitle || buttonImage))) {
                console.warn(
                    `Both onLeft and leftTitle/leftButtonImage
            must be specified for the scene: ${state.name}`,
                );
            }
            return null;
        }
        return tryRender(this.props.component, this.props.wrapBy) || tryRender(this.props);
    }

    animateStatus = () => {
        this.anim.setValue(0);

        Animated.timing(this.anim, {
            toValue: 1,
            duration: 3000,
            easing: Easing.in
        })
            .start(this.animate.bind(this));
    }

    renderTitle(childState, index:number) {


        let title = this.props.name ? this.props.name : null;

        const { isOnline , isCheckingOnline } = this.state

        return (
            <Animated.View
                key={childState.key}
                style={[
                    styles.titleWrapper
                ]}
            >
                <Animated.Text
                    lineBreakMode="tail"
                    numberOfLines={1}
                    style={[
                        styles.title,
                        {
                          opacity: this.props.position.interpolate({
                            inputRange: [index - 1, index, index + 1],
                            outputRange: [0, 1, 0],
                          }),
                          left: this.props.position.interpolate({
                            inputRange: [index - 1, index + 1],
                            outputRange: [200, -200],
                          }),
                          right: this.props.position.interpolate({
                            inputRange: [index - 1, index + 1],
                            outputRange: [-200, 200],
                          }),
                        },
                      ]}
                >
                    {title}
                </Animated.Text>
                <Animated.View
                    lineBreakMode="tail"
                    numberOfLines={1}
                    style={[
                        AppStyles.leftAligned,
                    {
                      opacity: this.props.position.interpolate({
                        inputRange: [index - 1, index, index + 1],
                        outputRange: [0, 1, 0],
                      }),
                      left: this.props.position.interpolate({
                        inputRange: [index - 1, index + 1],
                        outputRange: [200, -200],
                      }),
                      right: this.props.position.interpolate({
                        inputRange: [index - 1, index + 1],
                        outputRange: [-200, 200],
                      }),
                    },
                  ]}
                >
                    {!! isCheckingOnline &&
                        <View style={[AppStyles.row, AppStyles.centerAligned]}>
                            <Icon name="primitive-dot" size={20} color="grey" />
                            <Text style={[styles.statusText]}>Loading...</Text>
                        </View>
                    }

                    {!! isOnline && ! isCheckingOnline ? (
                        <View style={[AppStyles.row, AppStyles.centerAligned]}>
                            <Icon  name="primitive-dot" size={20} color="#008B45" />
                            <Text style={[styles.statusText]}>Online</Text>
                        </View>
                    ) : (
                        <View style={[AppStyles.row, AppStyles.centerAligned]}>
                            <Icon  name="primitive-dot" size={20} color="red" />
                            <Text style={[styles.statusText]}>Offline</Text>
                        </View>
                    )}


                </Animated.View>
            </Animated.View>
        );
    }

    render() {
        let state = this.props.navigationState;
        let selected = state.children[state.index];
        while ({}.hasOwnProperty.call(selected, 'children')) {
            state = selected;
            selected = selected.children[selected.index];
        }
        const navProps = { ...this.props, ...selected };

        const wrapByStyle = (component, wrapStyle) => {
            if (!component) { return null; }
            return props => <View style={wrapStyle}>{component(props)}</View>;
        };

        const leftButtonStyle = [styles.leftButton, { alignItems: 'flex-start' }];
        const rightButtonStyle = [styles.rightButton, { alignItems: 'flex-end' }];

        const renderLeftButton = wrapByStyle(selected.renderLeftButton, leftButtonStyle) ||
            wrapByStyle(selected.component.renderLeftButton, leftButtonStyle) ||
            this.renderLeftButton;
        const renderRightButton = wrapByStyle(selected.renderRightButton, rightButtonStyle) ||
            wrapByStyle(selected.component.renderRightButton, rightButtonStyle) ||
            this.renderRightButton;
        const renderBackButton = wrapByStyle(selected.renderBackButton, leftButtonStyle) ||
            wrapByStyle(selected.component.renderBackButton, leftButtonStyle) ||
            this.renderBackButton;
        const renderTitle = selected.renderTitle ||
            selected.component.renderTitle ||
            this.props.renderTitle;
        const navigationBarBackgroundImage = this.props.navigationBarBackgroundImage ||
            state.navigationBarBackgroundImage;
        const contents = (
            <View>
                {renderTitle ? renderTitle(navProps) : state.children.map(this.renderTitle, this)}
                {renderBackButton(navProps) || renderLeftButton(navProps)}
                {renderRightButton(navProps)}
            </View>
        );
        return (
            <Animated.View
                style={[
          styles.header,
          this.props.navigationBarStyle,
          state.navigationBarStyle,
          selected.navigationBarStyle,
        ]}
            >
                {navigationBarBackgroundImage ? (
                    <Image source={navigationBarBackgroundImage}>
                        {contents}
                    </Image>
                ) : contents}
            </Animated.View>
        );
    }
}

NavBar.propTypes = propTypes;
NavBar.contextTypes = contextTypes;
NavBar.defaultProps = defaultProps;

export default NavBar;
