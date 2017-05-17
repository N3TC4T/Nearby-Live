import React, { Component, PropTypes } from 'react';
import {
    View,
    FlatList,
    RefreshControl,
    InteractionManager,
} from 'react-native';

import moment from 'moment';

// Consts and Libs
import { AppColors, AppStyles, AppSizes } from '@theme/';
import { ErrorMessages, AppConfig } from '@constants/';
import AppAPI from '@lib/api';


// Components
import { List, ListItem } from '@components/ui';
import Loading from '@components/general/Loading';
import Error from '@components/general/Error';

/* Component ==================================================================== */
class NotificationsListing extends Component {
    static componentName = 'NotificationsListing';

    static propTypes = {
        notificationsListing: PropTypes.array.isRequired,
        getNotifications: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            isRefreshing:true,
            isLoadingMore:false,
            error:null,
        };

        this.state.dataSource = props.notificationsListing

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.notificationsListing !== this.props.notificationsListing) {
            this.setState({
                dataSource: nextProps.notificationsListing,
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

        await this.props.getNotifications(startFrom)
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

        const { notificationsListing } = this.props

        let startFrom = notificationsListing[notificationsListing.length -1 ].id

        this.props.getNotifications(startFrom)
            .then(() => {
                this.setState({
                    isLoadingMore: false ,
                });
            });

    }

    renderItem = (obj) => {
        const notification = obj.item
        return (
            <ListItem
                roundAvatar
                hideChevron={!notification.new}
                rightIcon={{name:'dot-single', type:'entypo', color:'#D8412F'}}
                containerStyle={{borderColor: notification.new ? '#D0E1F9' : 'white'}}
                key={notification.id}
                onPress={ () => { console.log('Notification Pressed!') }}
                title={notification.txt}
                titleStyle={{fontSize:12}}
                rightTitleContainerStyle={{flex:0.25}}
                subtitle={moment(notification.date).fromNow()}
                subtitleStyle={{textAlign:'left', fontSize:10}}
                rightTitleStyle={{fontSize:10}}
                avatar={{uri: notification.img ? notification.img : `${AppConfig.urls.imageCDN }1/120`} }
                avatarStyle={{ width: 35,height: 35}}
            />
        )
    }

    render = () => {
        const { notificationsListing, user  } = this.props;
        const { isRefreshing, dataSource } = this.state;


        if (isRefreshing && (!notificationsListing || notificationsListing.length < 1)) {
            return <Loading text={'Loading Notifications...'} />
        }



        // show alert on empty notifications
        if (!isRefreshing && (!notificationsListing || notificationsListing.length < 1)) {
            return (
                <View style={[AppStyles.container]}>
                    <Error text={ErrorMessages.notifications404} tryAgain={() => { this.fetchNotifications(true) } }  />
                </View>
            )
        }


        return (
            <View style={[AppStyles.container]}>
                <List containerStyle={[{marginTop:0, marginBottom:0}]}>
                    <FlatList
                        renderItem={notification => this.renderItem(notification)}
                        data={dataSource}
                        refreshing={isRefreshing}
                        onRefresh={() => {this.fetchNotifications(true)}}
                        onEndReached={this.LoadMore}
                        onEndReachedThreshold={100}
                        keyExtractor={item => item.id}
                    />
                </List>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default NotificationsListing;
