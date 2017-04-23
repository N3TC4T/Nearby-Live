
/**
 * Cards
 *
 <Card></Card>
 *
 */
import React, { Component, PropTypes } from 'react';
import { Card } from 'react-native-elements';

import {
    StyleSheet,
    Image,
    Text,
    View,
} from 'react-native'

// Consts and Libs
import { AppSizes, AppColors, AppStyles, AppFonts } from '@theme/';


/* Component ==================================================================== */
class CustomCard extends Component {
    static propTypes = {
        containerStyle: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.shape({}),
        ]),
        titleStyle: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.shape({}),
        ]),
    }

    static defaultProps = {
        containerStyle: [],
        titleStyle: [],
    }

    cardProps = () => {
        // Defaults
        const props = {
            dividerStyle: [{
                backgroundColor: AppColors.border,
            }],
            ...this.props,
            containerStyle: [{
                backgroundColor: AppColors.cardBackground,
                borderRadius: AppSizes.borderRadius,
                borderColor: AppColors.border,
            }],
            titleStyle: [
                AppStyles.h2,
                { marginBottom: 15 },
            ],
        };

        if (this.props.containerStyle) {
            props.containerStyle.push(this.props.containerStyle);
        }

        if (this.props.titleStyle) {
            props.titleStyle.push(this.props.titleStyle);
        }

        return props;
    }

    render = () => <Card {...this.cardProps()} />
}

export default CustomCard