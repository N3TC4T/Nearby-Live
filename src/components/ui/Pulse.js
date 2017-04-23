import React from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

class Pulse extends React.Component {

    constructor(props) {
        super(props);

        this.anim = new Animated.Value(0);
    }

    componentDidMount() {
        Animated.timing(this.anim, {
            toValue: 1,
            duration: this.props.interval,
            easing: Easing.in,
        })
            .start();
    }

    render() {
        const { size, pulseMaxSize, borderColor, backgroundColor, getStyle } = this.props;

        return (
            <View style={[styles.circleWrapper, {
				width: pulseMaxSize,
				height: pulseMaxSize,
				marginLeft: -pulseMaxSize/2,
				marginTop: -pulseMaxSize/2,
			}]}>
                <Animated.View
                    style={[styles.circle, {
						borderColor,
						backgroundColor,
						width: this.anim.interpolate({
							inputRange: [0, 1],
							outputRange: [size, pulseMaxSize]
						}),
						height: this.anim.interpolate({
							inputRange: [0, 1],
							outputRange: [size, pulseMaxSize]
						}),
						borderRadius: pulseMaxSize/2,
						opacity: this.anim.interpolate({
							inputRange: [0, 1],
							outputRange: [1, 0]
						})
					}, getStyle && getStyle(this.anim)]}
                />
            </View>
        );
    }
}


Pulse.propTypes = {
    interval: React.PropTypes.number,
    size: React.PropTypes.number,
    pulseMaxSize: React.PropTypes.number,
    borderColor: React.PropTypes.string,
    backgroundColor: React.PropTypes.string,
    getStyle: React.PropTypes.func,
};

Pulse.defaultProps = {
    interval: 2000,
    size: 100,
    pulseMaxSize: 250,
    borderColor: '#D8335B',
    backgroundColor: '#ED225B55',
    getStyle: undefined,
};

const styles = StyleSheet.create({
    circleWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: width/2,
        top: height/2,
    },
    circle: {
        borderWidth: 4 * StyleSheet.hairlineWidth,
    },
});



/* Export Component ==================================================================== */
export default Pulse;
