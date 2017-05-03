/**
 * Error Screen
 *
    <Error text={'Server is down'} />
 *
 */
import React, { PropTypes } from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements'

// Consts and Libs
import { AppStyles } from '@theme/';

// Components
import { Spacer, Text, Button } from '@ui/';

/* Component ==================================================================== */
const Error = ({ text, tryAgain }) => (
  <View style={[AppStyles.container, AppStyles.containerCentered]}>
    <Icon name={'emoticon-poop'} type={'material-community'} size={50} color={'#CCC'} />

    <Spacer size={10} />

    <Text style={AppStyles.textCenterAligned} h3>{text}</Text>

    <Spacer size={20} />

    {!!tryAgain &&
      <Button
        small
        title={'Try again'}
        onPress={tryAgain}
      />
    }
  </View>
);

Error.propTypes = { text: PropTypes.string, tryAgain: PropTypes.func };
Error.defaultProps = { text: 'Woops, Something went wrong.', tryAgain: null };
Error.componentName = 'Error';

/* Export Component ==================================================================== */
export default Error;

