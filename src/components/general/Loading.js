/**
 * Loading Screen
 *
 <Loading text={'Server is down'} />
 *
 */
import React, { PropTypes, Component } from 'react';
import { View } from 'react-native';
import Animation from 'lottie-react-native';

// Consts and Libs
import { AppStyles, AppSizes } from '@theme/';

// Components
import { Spacer, Text } from '@ui/';

/* Component ==================================================================== */
class Loading extends Component {
    static componentName = 'Loading';

    static propTypes = {
        text: PropTypes.string, transparent:
        PropTypes.bool
    }

    static defaultProps = {
        text: null,
        transparent: false
    };

    componentDidMount() {
        this.animation.play();
    }

    render = () => {
        const {transparent, text} = this.props

        return (
            <View
                style={[
                  AppStyles.container,
                  AppStyles.containerCentered,
                  transparent && { backgroundColor: 'rgba(255,255,255,0.75)' },
                ]}
            >
                <Animation
                    ref={animation => { this.animation = animation; }}
                    style={{
                      width: AppSizes.screen.width,
                      height: 200,
                     marginTop:AppSizes.screen.width*-0.50
                    }}
                    loop={true}
                    source={require('../../animations/loading.json')}
                />

                <Spacer size={10}/>

                {!!text && <Text h5>{text}</Text>}
            </View>
        );
    }


};



/* Export Component ==================================================================== */
export default Loading;
