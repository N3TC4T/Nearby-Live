/**
 * Conversations Listing Screen
 *  - Shows a list of conversations
 */

import moment from 'moment';

import React, { Component, PropTypes } from 'react';
import {
    View,
    FlatList,
    RefreshControl,
    InteractionManager,
} from 'react-native';


// Actions
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppColors, AppStyles , AppSizes } from '@theme/';
import { ErrorMessages } from '@constants/';
import { getImageURL } from '@lib/util'
import AppAPI from '@lib/api';

// Components
import Error from '@components/general/Error';
import Loading from '@components/general/Loading';
import ActionSheet from '@expo/react-native-action-sheet';
import { List, ListItem } from '@components/ui';
import { SearchBar, Icon } from 'react-native-elements'



moment.updateLocale('en', {
    relativeTime: {
        future: 'in %s',
        past: '%s',
        s:  '1s',
        ss: '%ss',
        m:  '1m',
        mm: '%dm',
        h:  '1h',
        hh: '%dh',
        d:  '1d',
        dd: '%dd',
        M:  '1M',
        MM: '%dM',
        y:  '1Y',
        yy: '%dY'
    }
});

/* Component ==================================================================== */

class ConversationsListing extends Component {
    static componentName = 'ConversationsListing';

    static propTypes = {
        conversationsListing: PropTypes.array,
        getConversations: PropTypes.func,
        uninitializeConversation: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            isRefreshing:true,
            isLoadingMore:false,
            startFrom:-1,
            error:null,
        };

        this.state.dataSource = props.conversationsListing

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.conversationsListing !== this.props.conversationsListing) {
            this.setState({
                dataSource: nextProps.conversationsListing,
            })
        }
    }

    componentDidMount () {
        InteractionManager.runAfterInteractions(() => {
            this.fetchConversations(true);
        });
    }

    /**
     * Fetch Data from API
     */
    fetchConversations = async (reFetch) => {

        let { startFrom } = this.state

        reFetch ? startFrom = -1 : null

        this.setState({ isRefreshing:true, error: null })

        await this.props.getConversations(startFrom)
            .then(() => {
                this.setState({
                    isRefreshing: false,
                    startFrom: startFrom + 26,
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


    LoadMore = async () => {

        const { isLoadingMore, startFrom } = this.state ;

        if ( isLoadingMore ) return; else this.setState({ isLoadingMore: true })

        await this.props.getConversations(startFrom)
            .then(() => {
                this.setState({
                    isLoadingMore: false ,
                    startFrom: startFrom + 26,
                });
            });

    }

    _onPressConversation = (conversation) => {

        const { uninitializeConversation } = this.props
        // we need first set init state of conversation to false
        uninitializeConversation(conversation.id)


        // then direct user to messages scence
        Actions.conversationView({
            pid: conversation.id,
            name: conversation.name
        });
    };


    _onPressOptions = () => {
        const options = ['Delete all', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        this._actionSheetRef.showActionSheetWithOptions({
                options,
                cancelButtonIndex,
            },
            (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        this.props.deleteConversations()
                        break;
                    default:
                }
            });
    }

    _onLongPress = (conversation) => {
        const options = ['Delete', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        this._actionSheetRef.showActionSheetWithOptions({
                options,
                cancelButtonIndex,
            },
            (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        this.props.deleteConversation(conversation.id)
                        break;
                    default:
                }
            });
    }


    renderItem = (obj) => {
        const conversation = obj.item
        let badgeProps  = {};


        //Todo: fix badge bug
        conversation.new > 0 ? badgeProps = {badge:{ value: conversation.new  , badgeTextStyle:{fontSize:10, fontWeight:'bold', color: 'orange'} , badgeContainerStyle: { padding:8,backgroundColor: '#002C54', borderRadius:5, marginTop:7 } } } : null ;

        return (
            <ListItem
                roundAvatar
                hideChevron
                key={conversation.id}
                onPress={ () => { this._onPressConversation(conversation) }}
                onLongPress={() => this._onLongPress(conversation)}
                title={conversation.name}
                rightTitleContainerStyle={{flex:0.25}}
                subtitle={
                    conversation.msg.length > 1 ? (
                    (conversation.msg.includes('[PHOTO-MSG]') ? '[Picture Message]' : ((conversation.msg).length > 48) ? (((conversation.msg).substring(0,80)) + '...') : conversation.msg)) : null
                }
                subtitleStyle={{textAlign:'left'}}
                rightTitle={moment(conversation.last).fromNow()}
                rightTitleStyle={{fontSize:10}}
                avatar={{uri: getImageURL(conversation.img, true)} }
                avatarStyle={{ width: 35,height: 35}}
                {...badgeProps }
            />
        )
    }

    _onSearchChange = (text) => {
        const { conversationsListing } = this.props

        newFilter = [];
        conversationsListing.forEach(function(item) {
            if (item.name.toLowerCase().indexOf(text) !== -1) {
                newFilter.push(item)
            }
        });

        this.setState({
            dataSource: newFilter
        })


    }



    render = () => {
        const { conversationsListing } = this.props;
        const { isRefreshing,  dataSource, error } = this.state;

        if (error) return <Error text={error} tryAgain={() => { this.fetchConversations(true) } } />;

        if (isRefreshing && (!conversationsListing || conversationsListing.length < 1)) {
            return <Loading text={'Loading Conversations...'} />
        }


        if (!isRefreshing && (!conversationsListing || conversationsListing.length < 1)) {
            return <Error text='No Message' tryAgain={() => { this.fetchConversations(true) } }  />;
        }

        return (
            <ActionSheet ref={component => this._actionSheetRef = component}>
                <View style={[AppStyles.container]}>
                    <View style={[AppStyles.row]}>
                        <View style={[AppStyles.flex6]}>
                            <SearchBar
                                onChangeText={this._onSearchChange}
                                inputStyle={{height:38}}
                                containerStyle={{backgroundColor:'transparent'}}
                                placeholder='Search messages'
                            />
                        </View>
                        <View style={[AppStyles.flex1, AppStyles.centerAligned]}>
                            <Icon
                                name='md-options'
                                type='ionicon'
                                color='grey'
                                underlayColor={'transparent'}
                                onPress={this._onPressOptions} />
                        </View>

                    </View>
                    <List containerStyle={{marginTop:0}}>
                        <FlatList
                            renderItem={conversation => this.renderItem(conversation)}
                            data={dataSource}
                            refreshing={isRefreshing}
                            onRefresh={() => {this.fetchConversations(true)}}
                            onEndReached={this.LoadMore}
                            onEndReachedThreshold={100}
                            keyExtractor={item => item.id}
                        />
                    </List>
                </View>
            </ActionSheet>

        );
    }
}

/* Export Component ==================================================================== */
export default ConversationsListing;
