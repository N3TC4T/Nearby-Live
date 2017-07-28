/**
 * Tabbar Icon
 *
    <TabIcon icon={'search'} selected={false} />
 *
 */
import { connect } from 'react-redux'

import React, { Component, PropTypes } from 'react';

import {
    StyleSheet,
    Text,
    View
} from 'react-native';

import { Icon } from '@ui/'
import { AppColors } from '@theme/';



/* Styles ==================================================================== */
const styles = StyleSheet.create({
    IconBadge: {
        position:'absolute',
        top:-4,
        right:6,
        width:15,
        height:15,
        borderRadius:15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF0000'
    }
});


/* Pass state to component ==================================================================== */
const mapStateToProps = (state , props )  => ({
    UnreadNotifyCount: props.tabType == 'notification-system' ? state.systemNotifications.UnreadCount : 0
});

class TabIcon extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        icon: PropTypes.string.isRequired,
        size:PropTypes.number,
        type: PropTypes.string,
        selected: PropTypes.bool,
        tabType: PropTypes.string,
        raised: PropTypes.bool,
    }

    static defaultProps = {
        icon: 'search',
        selected: false,
        size:26,
        tabType:'',
        raised:false
    };


    render() {

        const { title, icon, size, type, selected, raised } = this.props

        return(
            <View>
                <Icon
                    name={icon}
                    size={size}
                    type={type}
                    color={selected ? AppColors.tabbar.iconSelected : (raised ?  AppColors.tabbar.iconSelected : AppColors.tabbar.iconDefault)}
                    raised={raised}
                    containerStyle={{
                          backgroundColor:raised ? AppColors.tabbar.iconNew : 'transparent',
                          marginTop:raised ? 12 : 0
                     }}
                />
                <Text style={{color:selected ? AppColors.tabbar.iconSelected : AppColors.tabbar.iconDefault, fontSize:10}}>
                    { title }
                </Text>
                {this.props.UnreadNotifyCount > 0 &&
                    <View style={[styles.IconBadge]}>
                        <Text style={{color:'#FFFFFF', fontSize:10}}>
                            { this.props.UnreadNotifyCount > 100
                                ? 'N'
                                : this.props.UnreadNotifyCount
                            }
                        </Text>
                    </View>
                }
            </View>
        )
    }
}

export default connect(mapStateToProps)(TabIcon);