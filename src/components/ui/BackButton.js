/**
 * BackButton
 *
 <BackButton />
 *
 */
import React, { PropTypes } from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon } from '@components/ui';

import { Actions } from 'react-native-router-flux';



/* Component ==================================================================== */
const BackButton = ({size , color}) => (
    <TouchableOpacity onPress={Actions.pop}>
        <Icon name={"arrow-left"} size={size} type={"material-community"} color={color} />
    </TouchableOpacity>
);

BackButton.propTypes = { size: PropTypes.number, color:PropTypes.string };
BackButton.defaultProps = { size: 20, color:'#232F3A' };
BackButton.componentName = 'BackButton';

/* Export Component ==================================================================== */
export default BackButton;
