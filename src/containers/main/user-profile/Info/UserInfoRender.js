import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    FlatList,
    ScrollView,
    StyleSheet,
} from 'react-native';

import moment from 'moment';


// Consts and Libs
import { AppColors, AppStyles, AppSizes, AppFonts } from '@theme/';

// Components
import { Icon, Text } from '@components/ui';


/* Styles ==================================================================== */

const styles = StyleSheet.create({

});


/* Component ==================================================================== */
class RenderRow extends Component {
    static componentName = 'RenderRow';

    static propTypes = {
        icon:PropTypes.string,
        iconType:PropTypes.string,
        item:PropTypes.string,
        value:PropTypes.string,
    };

    render = () => {
        return (
            <View>
                <View style={[AppStyles.row , AppStyles.paddingSml]}>
                    <View style={[AppStyles.flex1, AppStyles.leftAligned]}>
                        <View style={[AppStyles.row]} >
                            <Icon
                                name={this.props.icon}
                                color={'#818F92'}
                                size={18}
                                type={this.props.iconType}
                                containerStyle={{paddingRight:5, paddingBottom:5}}
                            />
                            <Text p>
                                {this.props.item}
                            </Text>
                        </View>
                    </View>
                    {this.props.item != 'Additional Information' &&
                        <View style={[AppStyles.flex1, AppStyles.rightAligned]}>
                            <Text style={AppStyles.subtext}>
                                {this.props.value}
                            </Text>
                        </View>
                    }
                </View>

                {this.props.item == 'Additional Information' &&
                    <View style={[AppStyles.row, AppStyles.leftAligned, AppStyles.paddingSml]}>
                        <Text style={AppStyles.subtext}>
                            {this.props.value}
                        </Text>
                    </View>
                }

                <View style={AppStyles.hr} />
            </View>
        );
    }
}


/* Component ==================================================================== */
class UserInfoRender extends Component {
    static componentName = 'UserInfoRender';

    static propTypes = {
        profile: PropTypes.object.isRequired,
    };



    render = () => {
        const { profile  } = this.props;

        return (
            <ScrollView
                ref={(a) => { this.scrollView = a; }}
                style={[AppStyles.container]}
            >

                <RenderRow
                    icon={'marker'}
                    iconType={'foundation'}
                    item={'Distance'}
                    value={`${profile.dis} miles`}
                />

                <RenderRow
                    icon={'clock'}
                    iconType={'foundation'}
                    item={'Last Online'}
                    value={`${moment(profile.last).fromNow()} ago`}
                />

                <RenderRow
                    icon={'calendar'}
                    iconType={'foundation'}
                    item={'Age'}
                    value={`${profile.age} years old`}
                />

                <RenderRow
                    icon={'human-male-female'}
                    iconType={'material-community'}
                    item={'Gender'}
                    value={profile.gender ? (profile.gender == 2 ? 'Male' : 'Female' ) : 'Unspecified'}
                />

                <RenderRow
                    icon={'info'}
                    iconType={'foundation'}
                    item={'Additional Information'}
                    value={`${profile.info}`}
                />


            </ScrollView>
        );
    }
}

/* Export Component ==================================================================== */
export default UserInfoRender;
