import React, { Component, PropTypes } from 'react';
import {
    View,
    StyleSheet,
    Button,
    FlatList,
    RefreshControl,
    InteractionManager,
} from 'react-native';

import moment from 'moment';

// Consts and Libs
import { AppColors, AppStyles, AppSizes, AppFonts } from '@theme/';
import { getImageURL } from '@lib/util'
import { ErrorMessages } from '@constants/';
import AppAPI from '@lib/api';


// Components
import { Icon, Avatar, Text } from '@components/ui';
import Loading from '@components/general/Loading';
import Error from '@components/general/Error';


/* Styles ==================================================================== */

const styles = StyleSheet.create({
    headerContainer:{
        backgroundColor:'#FFF',
        borderBottomWidth: 0.8,
        borderColor:'#E9EBEE'
    },
    row: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 0,
        paddingHorizontal: 0,
        paddingVertical: 10,
        borderRadius: 2,
        marginBottom: 2,
        borderColor: '#C8C7CC',
        borderBottomWidth: 1,
    },
    message: {
        flex: 1,
        flexDirection: 'column',
        paddingLeft: 10,
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        fontSize:AppFonts.base.size * 0.85,
        flex: 1,
    },
    time:{
        marginLeft:3,
        fontSize: AppFonts.base.size * 0.7,
        color:'grey'
    },
    badgeContainer: {
        width:17,
        height:17,
        opacity:0.8,
        borderRadius:15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#006e95',
        marginTop:2,
    },
    badgeText:{
        color:'#FFFFFF',
        fontSize:AppFonts.base.size * 0.7
    },
    typeContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 35,
        height: 35,
        borderRadius: 50,
        borderColor:'grey',
        borderWidth:1,
        alignSelf: 'flex-start',
    },
});


/* Component ==================================================================== */
class SystemNotificationsListingRender extends Component {
    static componentName = 'SystemNotificationsListingRender';

    static propTypes = {
        systemNotificationsListing: PropTypes.array.isRequired,
        getSystemNotifications: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            isRefreshing:true,
            isLoadingMore:false,
            error:null,
        };

        this.state.dataSource = props.systemNotificationsListing

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.systemNotificationsListing !== this.props.systemNotificationsListing) {
            this.setState({
                dataSource: nextProps.systemNotificationsListing,
            })
        }
    }


    componentDidMount () {
        InteractionManager.runAfterInteractions(() => {
            this.fetchNotifications(true);
        });
    }

    fetchNotifications = async (reFetch = false) => {

        reFetch ? startFrom = -1 : null

        this.setState({ isRefreshing:true, error: null })

        await this.props.getSystemNotifications(startFrom)
            .then(() => {
                this.setState({
                    isRefreshing: false,
                    error: null,
                });
            }).catch((err) => {
                const error = AppAPI.handleError(err);
                this.setState({
                    isRefreshing: false,
                    error,
                });
            });
    }


    LoadMore = () => {

        const { isLoadingMore } = this.state ;

        if ( isLoadingMore ) return; else this.setState({ isLoadingMore: true })

        const { systemNotificationsListing } = this.props

        let startFrom = systemNotificationsListing[systemNotificationsListing.length -1 ].id

        this.props.getSystemNotifications(startFrom)
            .then(() => {
                this.setState({
                    isLoadingMore: false ,
                });
            });

    }

    renderTypeIcon =(type) => {

        let typeProps

        switch (type) {
            case 5:
                typeProps = { color:'#E05641', type:'material-icons', name:'favorite'}
                break;
            case 6:
                typeProps = { color:'#000', type:'material-community', name:'account-plus'}
                break;
            case 7:
                typeProps = { color:'#000', type:'material-community', name:'account-minus'}
                break;
            case 8:
                typeProps = { color:'#818F92', type:'entypo', name:'eye'}
                break;
            case 1:
                typeProps = { color:'#008DCB', type:'material-community', name:'gift'}
                break;
            default:
                typeProps = { color:'#D70026', type:'material-icons', name:'add-alert'}

        }

        return(
                <Icon color={"#FFF"} size={12} iconStyle={{marginTop:1}} {...typeProps} />
        )
    }


    renderItem = (obj) => {
        const notification = obj.item


        return(
            <View style={[ styles.row ]}>

                <Icon name={'dot-single'} type={"entypo"} size={25} iconStyle={{marginRight:-5, marginLeft:-5}} color={notification.new ? "#D8412F" : "transparent"}/>

                {!!notification.img ? (
                    <Avatar
                        source={{ uri: notification.img }}
                        imgKey={notification.img}
                    />
                ) : (
                    <Avatar />
                )}


                <View style={[ styles.message ]}>
                    <View style={[ styles.header ]}>
                        <Text style={[ styles.text ]}>
                            {notification.txt}
                        </Text>
                        <Icon name={'chevron-right'} type={'material-community'} size={17} color={'grey'} iconStyle={{paddingRight:5}}/>
                    </View>
                    <View style={[ styles.header ]}>
                        <View style={AppStyles.row}>
                            {this.renderTypeIcon(notification.type)}
                            <Text style={[styles.time]}>{moment(notification.date).fromNow()} ago</Text>
                        </View>
                    </View>

                </View>

            </View>
        )
    }

    render = () => {
        const { systemNotificationsListing, user  } = this.props;
        const { isRefreshing, dataSource } = this.state;


        if (isRefreshing && (!systemNotificationsListing || systemNotificationsListing.length < 1)) {
            return <Loading text={'Loading Notifications...'} />
        }



        // show alert on empty notifications
        if (!isRefreshing && (!systemNotificationsListing || systemNotificationsListing.length < 1)) {
            return (
                <View style={[AppStyles.container]}>
                    <Error text={ErrorMessages.notifications404} tryAgain={() => { this.fetchNotifications(true) } }  />
                </View>
            )
        }


        return (
            <View style={[AppStyles.container]}>
                <FlatList
                    renderItem={notification => this.renderItem(notification)}
                    data={dataSource}
                    refreshing={isRefreshing}
                    onRefresh={() => {this.fetchNotifications(true)}}
                    onEndReached={this.LoadMore}
                    onEndReachedThreshold={100}
                    keyExtractor={item => item.id}
                />
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default SystemNotificationsListingRender;
