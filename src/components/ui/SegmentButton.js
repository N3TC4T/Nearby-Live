import PropTypes from 'prop-types';
import React from 'react';
import {
    View,
    Text as NativeText,
    StyleSheet,
    ViewPropTypes,
    TouchableHighlight,
    Platform
} from 'react-native';

import {Text} from '@ui/';
import {AppColors} from '@theme/';

const ButtonGroup = (props) => {
    const {
        component,
        buttons,
        onPress,
        selectedIndex,
        containerStyle,
        innerBorderStyle,
        lastBorderStyle,
        buttonStyle,
        textStyle,
        selectedTextStyle,
        selectedBackgroundColor,
        underlayColor,
        activeOpacity,
        onHideUnderlay,
        onShowUnderlay,
        setOpacityTo,
        containerBorderRadius,
        ...attributes
    } = props;

    const Component = component || TouchableHighlight;
    return (
        <View
            style={[styles.container, containerStyle && containerStyle]}
            {...attributes}
        >
            {buttons.map((button, i) => (
                <Component
                    activeOpacity={activeOpacity}
                    setOpacityTo={setOpacityTo}
                    onHideUnderlay={onHideUnderlay}
                    onShowUnderlay={onShowUnderlay}
                    underlayColor={underlayColor || '#ffffff'}
                    onPress={onPress ? () => onPress(i) : () => {}}
                    key={i}
                    style={[
                        styles.button,
                        i < buttons.length - 1 && {
                            borderRightWidth: (innerBorderStyle &&
                  innerBorderStyle.width) ||
                  1,
                            borderRightColor: (innerBorderStyle &&
                  innerBorderStyle.color) ||
                  AppColors.segmentButton.borderColor
                        },
                        i === buttons.length - 1 && {
                            ...lastBorderStyle,
                            borderTopRightRadius: containerBorderRadius || 3,
                            borderBottomRightRadius: containerBorderRadius || 3
                        },
                        i === 0 && {
                            borderTopLeftRadius: containerBorderRadius || 3,
                            borderBottomLeftRadius: containerBorderRadius || 3
                        },
                        selectedIndex === i && {
                            backgroundColor: selectedBackgroundColor || AppColors.segmentButton.selectedBackground
                        }
                    ]}
                >
                    <View style={[styles.textContainer, buttonStyle && buttonStyle]}>
                        {button.element
                            ? <button.element />
                            : <Text
                                style={[
                                    styles.buttonText,
                                    textStyle && textStyle,
                                    selectedIndex === i && {color: AppColors.segmentButton.selectedTextColor},
                                    selectedIndex === i && selectedTextStyle
                                ]}
                            >
                                {button}
                            </Text>}
                    </View>
                </Component>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        flex: 1
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
        marginTop: 5,
        borderColor: AppColors.segmentButton.borderColor,
        borderWidth: 1,
        flexDirection: 'row',
        borderRadius: 3,
        overflow: 'hidden',
        backgroundColor: AppColors.segmentButton.background,
        height: 25
    },
    buttonText: {
        fontSize: 11,
        color: AppColors.segmentButton.textColor,
        ...Platform.select({
            ios: {
                fontWeight: '500'
            }
        })
    }
});

ButtonGroup.propTypes = {
    button: PropTypes.object,
    component: PropTypes.any,
    onPress: PropTypes.func,
    buttons: PropTypes.array,
    containerStyle: ViewPropTypes.style,
    textStyle: NativeText.propTypes.style,
    selectedTextStyle: NativeText.propTypes.style,
    underlayColor: PropTypes.string,
    selectedIndex: PropTypes.number,
    activeOpacity: PropTypes.number,
    onHideUnderlay: PropTypes.func,
    onShowUnderlay: PropTypes.func,
    setOpacityTo: PropTypes.any,
    innerBorderStyle: PropTypes.shape({
        color: PropTypes.string,
        width: PropTypes.number
    }),
    lastBorderStyle: PropTypes.oneOfType([
        ViewPropTypes.style,
        NativeText.propTypes.style
    ]),
    buttonStyle: ViewPropTypes.style,
    selectedBackgroundColor: PropTypes.string,
    containerBorderRadius: PropTypes.number
};

export default ButtonGroup;
