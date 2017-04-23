import React, { Component, PropTypes } from 'react';
import {
    Animated,
    View,
    Image,
    StyleSheet
} from 'react-native';


export default class AvatarImage extends Component{
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
                    style = {[
                       styles.roundAvatar
                   ]}
                    source = {this.props.source}
                    onLoad = {(event)=>this.onLoad(event)}
                />

                { !completelyLoaded &&

                    <Animated.Image
                        resizeMode={'contain'}
                        style={[
                           {
                             opacity: this.state.thumbnailOpacity,
                             position: 'absolute'

                             },
                             styles.roundAvatar
                         ]}
                        source={require('../../images/placeholder.user.png')}
                        onLoad={(event) => this.onThumbnailLoad(event)}
                    />
                }
            </View>
        )
    }
}

/* Component Styles ==================================================================== */

const styles = StyleSheet.create({
    roundAvatar:{
        height: 35,
        width:35,
        borderRadius: 50,

    },
})
