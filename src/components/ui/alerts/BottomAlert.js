import React, {Component, PropTypes} from 'react'
import {
    Animated,
    InteractionManager,
    StatusBar,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View
} from 'react-native'

let BAR_HEIGHT = 18
let BACKGROUND_COLOR = '#3DD84C'
let TOUCHABLE_BACKGROUND_COLOR = '#3DD84C'
const SLIDE_DURATION = 300
const ACTIVE_OPACITY = 0.6
const SATURATION = 0.9
const DURATION = 3000


export default class BottomAlert extends Component {

    constructor(props) {
        super(props)

        this.state = {
            height: new Animated.Value(0),
            opacity: new Animated.Value(0),
        }

        this.timer = null
    }

    show(text, type, duration) {

        this.duration = duration || DURATION;

        this.state.isShow ? (this.timer ? clearTimeout(this.timer) : null): null

        this.setState({
            isShow: true,
            text: text,
            alertType:type,
        });

        // Slide animation
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
            ]).start()
        })

        if(this.duration) {
            // Hide after time
            this.timer = setTimeout(() => {
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
                    ]).start()
                })

            }, this.duration);
        }

    }


    componentWillUnmount() {
        clearTimeout(this.timer)
    }


    render() {
        if (this.state.alertType === 'error') {
            BACKGROUND_COLOR = '#C02827'
            TOUCHABLE_BACKGROUND_COLOR = '#FB6567'
        } else if (this.state.alertType === 'success') {
            BACKGROUND_COLOR = '#3CC29E'
            TOUCHABLE_BACKGROUND_COLOR = '#59DC9A'
        } else if (this.state.alertType === 'info') {
            BACKGROUND_COLOR = '#3b6976'
            TOUCHABLE_BACKGROUND_COLOR = '#8EDBE5'
        }

        return (
            <View>
                {this.state.isShow &&
                    <Animated.View style={[styles.view, {
                            height: this.state.height,
                            opacity: this.state.opacity,
                            backgroundColor: saturate(BACKGROUND_COLOR, SATURATION)
                          }]}>
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
                                {this.state.text}
                            </Animated.Text>
                        </TouchableOpacity>
                    </Animated.View>
                }
            </View>
        )
    }

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

BottomAlert.propTypes = {
    onPress: PropTypes.func
}

BottomAlert.defaultProps = {
    onPress: null
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