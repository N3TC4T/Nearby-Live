import PropTypes from 'prop-types';
import React from 'react';
import {
    Platform,
    TouchableHighlight,
    View,
    StyleSheet,
    Text as NativeText,
} from 'react-native';

import ZocialIcon from 'react-native-vector-icons/Zocial';
import OcticonIcon from 'react-native-vector-icons/Octicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';

getIconType = (type) => {
    switch (type) {
        case 'zocial':
            return ZocialIcon;
        case 'octicon':
            return OcticonIcon;
        case 'material':
            return MaterialIcon;
        case 'material-community':
            return MaterialCommunityIcon;
        case 'ionicon':
            return Ionicon;
        case 'foundation':
            return FoundationIcon;
        case 'evilicon':
            return EvilIcon;
        case 'entypo':
            return EntypoIcon;
        case 'font-awesome':
            return FAIcon;
        case 'simple-line-icon':
            return SimpleLineIcon;
        default:
            return MaterialIcon;
    }
};



const Icon = props => {
    const {
        type,
        name,
        size,
        color,
        iconStyle,
        component,
        underlayColor,
        reverse,
        raised,
        containerStyle,
        reverseColor,
        onPress,
        ...attributes
    } = props;

    let Component = View;
    if (onPress) {
        Component = TouchableHighlight;
    }
    if (component) {
        Component = component;
    }
    let Icon;
    if (!type) {
        Icon = getIconType('material');
    } else {
        Icon = getIconType(type);
    }
    return (
        <Component
            underlayColor={reverse ? color : underlayColor || color}
            style={[
        (reverse || raised) && styles.button,
        (reverse || raised) && {
          borderRadius: size + 4,
          height: size * 2 + 4,
          width: size * 2 + 4,
        },
        raised && styles.raised,
        {
          backgroundColor: reverse ? color : raised ? 'white' : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        },
        containerStyle && containerStyle,
      ]}
            onPress={onPress}
            {...attributes}
        >
            <Icon
                style={[{ backgroundColor: 'transparent' }, iconStyle && iconStyle]}
                size={size}
                name={name}
                color={reverse ? reverseColor : color}
            />
        </Component>
    );
};

Icon.propTypes = {
    type: PropTypes.string,
    name: PropTypes.string,
    size: PropTypes.number,
    color: PropTypes.string,
    component: PropTypes.element,
    underlayColor: PropTypes.string,
    reverse: PropTypes.bool,
    raised: PropTypes.bool,
    containerStyle: View.propTypes.style,
    iconStyle: NativeText.propTypes.style,
    onPress: PropTypes.func,
    reverseColor: PropTypes.string,
};

Icon.defaultProps = {
    underlayColor: 'white',
    reverse: false,
    raised: false,
    size: 24,
    color: 'black',
    reverseColor: 'white',
};

const styles = StyleSheet.create({
    button: {
        margin: 7,
    },
    raised: {
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(0,0,0, .4)',
                shadowOffset: { height: 1, width: 1 },
                shadowOpacity: 1,
                shadowRadius: 1,
            },
            android: {
                elevation: 2,
            },
        }),
    },
});

export default Icon;