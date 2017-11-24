/**
 * Loading Screen
 *
 <Loading text={'Loading ...'} />
 *
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import ProgressCircle from 'react-native-progress/Circle';

// Consts and Libs
import {AppStyles} from '@theme/';

// Components
import {Spacer, Text} from '@ui/';

/* Component ==================================================================== */
class Loading extends Component {
    static componentName = 'Loading';

    static propTypes = {
        text: PropTypes.string,
        transparent:
        PropTypes.bool
    }

    static defaultProps = {
        text: null,
        transparent: false
    };

    render = () => {
        const {transparent, text} = this.props;

        return (
            <View
                style={[
                    AppStyles.container,
                    AppStyles.containerCentered,
                    transparent && {backgroundColor: 'rgba(255,255,255,0.75)'}
                ]}
            >
                <ProgressCircle borderWidth={3} indeterminate size={50} />

                <Spacer size={10} />

                {!!text && <Text h5>{text}</Text>}
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default Loading;
