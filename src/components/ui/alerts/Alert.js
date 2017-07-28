import React, {Component, PropTypes} from 'react'
import {
    Animated,
    InteractionManager,
    StatusBar,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View,
    ViewPropTypes
} from 'react-native'

import RootSiblings from 'react-native-root-siblings';



let BAR_HEIGHT = 18
let BACKGROUND_COLOR = '#3DD84C'
let TOUCHABLE_BACKGROUND_COLOR = '#3DD84C'
const SLIDE_DURATION = 300
const ACTIVE_OPACITY = 0.6
const SATURATION = 0.9

const durations = {
    LONG: 3500,
    SHORT: 2000
};

const types = {
    ERROR:'error',
    SUCCESS:'success',
    INFO:'info'
}

const styles = {
    view: {
        height: BAR_HEIGHT * 2,
        bottom: 0,
        right: 0,
        left: 0,
        position:'absolute'
    },
    touchableOpacity: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    text: {
        height: BAR_HEIGHT,
        marginBottom: BAR_HEIGHT / 2,
        marginTop: BAR_HEIGHT / 2,
        fontSize: 13,
        fontWeight: '400',
        lineHeight: 15,
        textAlign: 'center',
        color: 'white',
    }
}


function saturate(color, percent) {
    let R = parseInt(color.substring(1, 3), 16)
    let G = parseInt(color.substring(3, 5), 16)
    let B = parseInt(color.substring(5, 7), 16)
    R = parseInt(R * percent)
    G = parseInt(G * percent)
    B = parseInt(B * percent)
    R = (R < 255) ? R : 255
    G = (G < 255) ? G : 255
    B = (B < 255) ? B : 255
    let r = ((R.toString(16).length == 1) ? '0' + R.toString(16) : R.toString(16))
    let g = ((G.toString(16).length == 1) ? '0' + G.toString(16) : G.toString(16))
    let b = ((B.toString(16).length == 1) ? '0' + B.toString(16) : B.toString(16))
    return `#${r + g + b}`
}



class AlertContainer extends Component {

    static propTypes = {
        ...ViewPropTypes,
        duration: PropTypes.number,
        delay: PropTypes.number,
        visible: PropTypes.bool,
        type: PropTypes.string,
    };

    static defaultProps = {
        visible: false,
        duration: durations.LONG,
        type: types.SUCCESS,
    };

    constructor(props) {
        super(props)

        this.state = {
            visible: this.props.visible,
            height: new Animated.Value(0),
            opacity: new Animated.Value(0),
        }

        this.timer = null
    }

    componentDidMount () {
        if (this.state.visible) {
            this._showTimeout = setTimeout(() => this._show(), this.props.delay);
        }
    }

    componentWillReceiveProps = nextProps => {
        if (nextProps.visible !== this.props.visible) {
            if (nextProps.visible) {
                clearTimeout(this._showTimeout);
                clearTimeout(this._hideTimeout);
                this._showTimeout = setTimeout(() => this._show(), this.props.delay);
            } else {
                this._hide();
            }

            this.setState({
                visible: nextProps.visible
            });
        }
    };


    componentWillUnmount () {
        this._hide();
    };

    shouldComponentUpdate = (nextProps, nextState) => {
        return this.state.visible !== nextState.visible;
    };


    _animating = false;
    _root = null;
    _hideTimeout = null;
    _showTimeout = null;

    _show = () => {
        clearTimeout(this._showTimeout);
        if (!this._animating) {
            clearTimeout(this._hideTimeout);
            this._animating = true;
            this._root.setNativeProps({
                pointerEvents: 'auto'
            });
            requestAnimationFrame(() => {
                Animated.parallel([
                    Animated.timing(
                        this.state.height,
                        {
                            toValue: BAR_HEIGHT * 2,
                            duration: SLIDE_DURATION
                        }
                    ),
                    Animated.timing(
                        this.state.opacity,
                        {
                            toValue: 1,
                            duration: SLIDE_DURATION
                        }
                    )
                ]).start(({finished}) => {
                    if (finished) {
                        this._animating = !finished;
                        if (this.props.duration > 0) {
                            this._hideTimeout = setTimeout(() => this._hide(), this.props.duration);
                        }
                    }
                });
            })

        }
    };


    _hide = () => {
        clearTimeout(this._showTimeout);
        clearTimeout(this._hideTimeout);
        if (!this._animating) {
            this._root.setNativeProps({
                pointerEvents: 'none'
            });

            requestAnimationFrame(() => {
                Animated.parallel([
                    Animated.timing(
                        this.state.height,
                        {
                            toValue: 0,
                            duration: SLIDE_DURATION
                        }
                    ),
                    Animated.timing(
                        this.state.opacity,
                        {
                            toValue: 0,
                            duration: SLIDE_DURATION
                        }
                    )
                ]).start(({finished}) => {
                    if (finished) {
                        this._animating = false;
                    }
                });
            })
        }
    };


    render() {
        let {props} =  this;
        let alertType = props.type;


        if (alertType === 'error') {
            BACKGROUND_COLOR = '#C02827'
            TOUCHABLE_BACKGROUND_COLOR = '#FB6567'
        } else if (alertType === 'success') {
            BACKGROUND_COLOR = '#3CC29E'
            TOUCHABLE_BACKGROUND_COLOR = '#59DC9A'
        } else if (alertType === 'info') {
            BACKGROUND_COLOR = '#3b6976'
            TOUCHABLE_BACKGROUND_COLOR = '#8EDBE5'
        }

        return (this.state.visible || this._animating) ? <Animated.View
            style={[styles.view, {
                            height: this.state.height,
                            opacity: this.state.opacity,
                            backgroundColor: saturate(BACKGROUND_COLOR, SATURATION)
              }]}
            pointerEvents="none"
            ref={ele => this._root = ele}
        >
            <TouchableOpacity
                style={[styles.touchableOpacity, {
                               backgroundColor: saturate(TOUCHABLE_BACKGROUND_COLOR, SATURATION)
                             }]}
                onPress={this.props.onPress}
                activeOpacity={ACTIVE_OPACITY}
            >
                <Animated.Text
                    style={[styles.text, {
                                     color: styles.text.color,
                                     opacity: 1
                                }]}
                    allowFontScaling={false}
                >
                    {this.props.children}
                </Animated.Text>
            </TouchableOpacity>
        </Animated.View> : null;
    }


}


class Alert extends Component {
    static displayName = 'Alert';
    static propTypes = AlertContainer.propTypes;
    static types = types;
    static durations = durations;

    static show = (message, options = {type: types.SUCCESS, duration: durations.LONG}) => {
        return new RootSiblings(<AlertContainer
            {...options}
            visible={true}
        >
            {message}
        </AlertContainer>);
    };

    static hide = toast => {
        if (alert instanceof RootSiblings) {
            alert.destroy();
        } else {
            console.warn(`Alert.hide expected a \`RootSiblings\` instance as argument.\nBut got \`${typeof alert}\` instead.`);
        }
    };

    _alert = null;

    componentWillMount () {
        this._alert = new RootSiblings(<AlertContainer
            {...this.props}
            duration={0}
        />);
    };

    componentWillReceiveProps = nextProps => {
        this._toast.update(<AlertContainer
            {...nextProps}
            duration={0}
        />);
    };

    componentWillUnmount () {
        this._alert.destroy();
    };

    render() {
        return null;
    }
}


export default Alert;

