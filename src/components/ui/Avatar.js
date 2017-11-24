import React, {Component} from 'react';
import {
    Animated,
    View,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import PropTypes from 'prop-types';

export default class AvatarImage extends Component {
    static propTypes = {
        source: Image.propTypes.source.isRequired,
        imgKey: PropTypes.string,
        size: PropTypes.number,
        onPress: PropTypes.func
    };

    static defaultProps = {
        size: 35,
        imgKey: null,
        onPress: null
    };

    constructor(props) {
        super(props);

        this.state = {
            thumbnailOpacity: new Animated.Value(0),
            completelyLoaded: false
        };
    }
    onLoad() {
        Animated.timing(this.state.thumbnailOpacity, {
            toValue: 0,
            duration: 250
        }).start();

        this.setState({completelyLoaded: true});
    }
    onThumbnailLoad() {
        Animated.timing(this.state.thumbnailOpacity, {
            toValue: 1,
            duration: 250
        }).start();
    }

    render() {
        const {completelyLoaded} = this.state;

        return (
            <TouchableWithoutFeedback
                onPress={this.props.onPress ? this.props.onPress : null}>
                <View>
                    <Animated.Image
                        resizeMode='contain'
                        key={this.props.imgKey}
                        style={{
                            height: this.props.size,
                            width: this.props.size,
                            borderRadius: 50
                        }}
                        source={this.props.source ? this.props.source : require('../../assets/image/placeholder.user.png')}
                        onLoad={event => this.onLoad(event)}
                    />

                    { !completelyLoaded &&

                    <Animated.Image
                        resizeMode='contain'
                        style={[
                            {
                                opacity: this.state.thumbnailOpacity,
                                position: 'absolute',
                                height: this.props.size,
                                width: this.props.size,
                                borderRadius: 50
                            }
                        ]}
                        source={require('../../assets/image/placeholder.user.png')}
                        onLoad={event => this.onThumbnailLoad(event)}
                    />
                    }
                </View>
            </TouchableWithoutFeedback>

        );
    }
}
