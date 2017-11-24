/**
 * Placeholder Scene
 *
    <Placeholder text={"Hello World"} />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';

// Consts and Libs
import {AppStyles} from '@theme/';

// Components
import {Text} from '@ui/';

/* Component ==================================================================== */
const Placeholder = ({text}) => (
    <View style={[AppStyles.container, AppStyles.containerCentered]}>
        <Text>{text}</Text>
    </View>
);

Placeholder.propTypes = {text: PropTypes.string};
Placeholder.defaultProps = {text: 'placeholder'};
Placeholder.componentName = 'Placeholder';

/* Export Component ==================================================================== */
export default Placeholder;
