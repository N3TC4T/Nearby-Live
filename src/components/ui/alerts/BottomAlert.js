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

class BottomAlert extends Component {

    constructor(props) {
        super(props)

        this.state = {
            height: new Animated.Value(0),
            opacity: new Animated.Value(0),
        }

        this.timer = null
    }

    componentDidMount() {
        if (this.props.visible === true) {
            // Slide animation
            requestAnimationFrame(() => {
                Animated.parallel([
                    Animated.timing(
                        this.state.height,
                        {
                            toValue: this.props.statusbarHeight * 2,
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

            if(this.props.hideAfter){
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

                }, 3000);
            }

        }

        if (this.props.statusbarHeight) STATUS_BAR_HEIGHT = this.props.statusbarHeight
    }

    componentWillUnmount() {
        clearTimeout(this.timer)
    }

    componentWillReceiveProps(nextProps) {

        if(nextProps.hideAfter){
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

            }, 3000);
        }

        if (this.props.statusbarHeight) STATUS_BAR_HEIGHT = this.props.statusbarHeight
    }

    render() {
        if (this.props.alertType === 'error') {
            BACKGROUND_COLOR = '#C02827'
            TOUCHABLE_BACKGROUND_COLOR = '#FB6567'
        } else if (this.props.alertType === 'success') {
            BACKGROUND_COLOR = '#3CC29E'
            TOUCHABLE_BACKGROUND_COLOR = '#59DC9A'
        } else if (this.props.alertType === 'info') {
            BACKGROUND_COLOR = '#3b6976'
            TOUCHABLE_BACKGROUND_COLOR = '#8EDBE5'
        }

        return (

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
                                 color: this.props.color || styles.text.color,
                                 opacity: 1
                            }]}
                        allowFontScaling={false}
                    >
                        {this.props.message}
                    </Animated.Text>
                </TouchableOpacity>
            </Animated.View>
        )

    }

}

let STATUS_BAR_HEIGHT = 20
let BACKGROUND_COLOR = '#3DD84C'
let TOUCHABLE_BACKGROUND_COLOR = '#3DD84C'
const SLIDE_DURATION = 300
const ACTIVE_OPACITY = 0.6
const SATURATION = 0.9

const styles = {
    view: {
        height: STATUS_BAR_HEIGHT * 2,
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
        height: STATUS_BAR_HEIGHT,
        marginBottom: STATUS_BAR_HEIGHT / 2,
        fontSize: 13,
        fontWeight: '400',
        lineHeight: 15,
        textAlign: 'center',
        color: 'white',
    }
}

BottomAlert.propTypes = {
    visible: PropTypes.bool.isRequired,
    alertType: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    hideAfter: PropTypes.bool,
    onPress: PropTypes.func
}

BottomAlert.defaultProps = {
    visible: false,
    alertType: 'success',
    message: '',
    hideAfter:true,
    statusbarHeight: STATUS_BAR_HEIGHT,
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

export default BottomAlert