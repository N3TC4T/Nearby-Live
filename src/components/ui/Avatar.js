import React, { Component, PropTypes } from 'react';
import {
    Animated,
    View,
    Image,
    StyleSheet
} from 'react-native';


export default class AvatarImage extends Component{

    static propTypes = {
        source: Image.propTypes.source,
        imgKey: PropTypes.string,
        size: PropTypes.number
    }

    static defaultProps = {
        size:35
    };

    constructor(props){
        super(props);

        this.state = {
            thumbnailOpacity: new Animated.Value(0) ,
            completelyLoaded: false
        }
    }
    onLoad(){
        Animated.timing(this.state.thumbnailOpacity,{
            toValue: 0,
            duration : 250
        }).start()

        this.setState({completelyLoaded:true})

    }
    onThumbnailLoad(){
        Animated.timing(this.state.thumbnailOpacity,{
            toValue: 1,
            duration: 250
        }).start();
    }
    render(){
        let { completelyLoaded } = this.state

        return (
            <View>

                <Animated.Image
                    resizeMode = {'contain'}
                    key = {this.props.imgKey}
                    style = {{
                        height: this.props.size,
                        width:this.props.size,
                        borderRadius: 50,
                   }}
                    source = {this.props.source ? this.props.source : require('../../assets/image/placeholder.user.png') }
                    onLoad = {(event)=>this.onLoad(event)}
                />

                { !completelyLoaded &&

                    <Animated.Image
                        resizeMode={'contain'}
                        style={[
                           {
                             opacity: this.state.thumbnailOpacity,
                             position: 'absolute',
                             height: this.props.size,
                             width:this.props.size,
                             borderRadius: 50,
                            }
                         ]}
                        source={require('../../assets/image/placeholder.user.png')}
                        onLoad={(event) => this.onThumbnailLoad(event)}
                    />
                }
            </View>
        )
    }
}
