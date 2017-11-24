/**
 * Conversations Listing Screen
 *  - Shows a list of conversations
 */

import moment from 'moment';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    InteractionManager
} from 'react-native';

// Actions
import {Actions} from 'react-native-router-flux';

// Consts and Libs
import {AppStyles, AppFonts} from '@theme/';
import {getImageURL} from '@lib/util';
import AppAPI from '@lib/api';

// Components
import Error from '@components/general/Error';
import Loading from '@components/general/Loading';
import ActionSheet from '@expo/react-native-action-sheet';
import {Text, Avatar, Icon, SearchBar} from '@components/ui';

moment.updateLocale('en', {
    relativeTime: {
        future: 'in %s',
        past: '%s',
        s: '1s',
        ss: '%ss',
        m: '1m',
        mm: '%dm',
        h: '1h',
        hh: '%dh',
        d: '1d',
        dd: '%dd',
        M: '1M',
        MM: '%dM',
        y: '1Y',
        yy: '%dY'
    }
});

/* Styles ==================================================================== */

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: '#FFF',
        borderBottomWidth: 0.8,
        borderColor: '#E9EBEE'
    },
    row: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 0,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 2,
        marginBottom: 2,
        borderColor: '#C8C7CC',
        borderBottomWidth: 1
    },
    message: {
        flex: 1,
        flexDirection: 'column',
        paddingLeft: 10
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    user: {
        fontWeight: 'bold',
        flex: 1,
        marginBottom: 2
    },
    time: {
        fontSize: AppFonts.base.size * 0.7,
        color: 'grey'
    },
    badgeContainer: {
        width: 17,
        height: 17,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#006e95',
        marginTop: 2
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: AppFonts.base.size * 0.7,
        fontWeight: '600'
    }
});

/* Component ==================================================================== */

class ConversationsListing extends Component {
    static componentName = 'ConversationsListing';

    static propTypes = {
        conversationsListing: PropTypes.array.isRequired,
        getConversations: PropTypes.func.isRequired,
        uninitializeConversation: PropTypes.func.isRequired,
        deleteConversations: PropTypes.func.isRequired,
        deleteConversation: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            isRefreshing: true,
            isLoadingMore: false,
            startFrom: -1,
            error: null
        };

        this.state.dataSource = props.conversationsListing;
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.fetchConversations(true);
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.conversationsListing !== this.props.conversationsListing) {
            this.setState({
                dataSource: nextProps.conversationsListing
            });
        }
    }

    onPressOptions = () => {
        const options = ['Delete all', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        this.actionSheetRef.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex
            },
            (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        this.props.deleteConversations();
                        break;
                    default:
                }
            },
        );
    };

    onPressConversation = (conversation) => {
        const {uninitializeConversation} = this.props;
        // we need first set init state of conversation to false
        uninitializeConversation(conversation.id);

        // then direct user to messages scence
        Actions.conversationView({
            pid: conversation.id,
            name: conversation.name
        });
    };

    onLongPress = (conversation) => {
        const options = ['Delete', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        this.actionSheetRef.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex
            },
            (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        this.props.deleteConversation(conversation.id);
                        break;
                    default:
                }
            },
        );
    };

    onSearchChange = (text) => {
        const {conversationsListing} = this.props;

        const newFilter = [];
        conversationsListing.forEach((item) => {
            if (item.name.toLowerCase().indexOf(text) !== -1) {
                newFilter.push(item);
            }
        });

        this.setState({
            dataSource: newFilter
        });
    };

    fetchConversations = async(reFetch) => {
        let {startFrom} = this.state;

        if (reFetch) {
            startFrom = -1;
        }

        this.setState({isRefreshing: true, error: null});

        await this.props.getConversations(startFrom)
            .then(() => {
                this.setState({
                    isRefreshing: false,
                    startFrom: startFrom + 26,
                    error: null
                });
            }).catch((err) => {
                const error = AppAPI.handleError(err);
                this.setState({
                    isRefreshing: false,
                    error
                });
            });
    };

    LoadMore = async() => {
        const {isLoadingMore, startFrom} = this.state;

        if (isLoadingMore) {return;} this.setState({isLoadingMore: true});

        await this.props.getConversations(startFrom)
            .then(() => {
                this.setState({
                    isLoadingMore: false,
                    startFrom: startFrom + 26
                });
            });
    };

    renderItem = (obj) => {
        const conversation = obj.item;

        return (
            <TouchableOpacity
                style={[styles.row]}
                onPress={() => { this.onPressConversation(conversation); }}
            >
                {conversation.img ? (
                    <Avatar
                        source={{uri: getImageURL(conversation.img, true)}}
                        imgKey={conversation.img}
                    />
                ) : (
                    <Avatar
                        source={{uri: getImageURL()}}
                    />
                )}
                <View style={[styles.message]}>
                    <View style={[styles.header]}>
                        <Text style={[styles.user]}>
                            {conversation.name.replace(/(\r\n|\n|\r)/gm, '')}
                        </Text>

                        <Text style={[styles.time]}>{moment(conversation.last).fromNow()}</Text>

                    </View>
                    <View style={[styles.header]}>
                        <Text style={[AppStyles.subtext, AppStyles.flex4]}>
                            {
                                // Todo: Fix me
                                // eslint-disable-next-line no-nested-ternary
                                conversation.msg.length > 1 ? ((conversation.msg.includes('[PHOTO-MSG]') ? '[Picture Message]' : ((conversation.msg).length > 48) ? (`${(conversation.msg).replace(/(\r\n|\n|\r)/gm, '').substring(0, 80)}...`) : conversation.msg.replace(/(\r\n|\n|\r)/gm, ''))) : null
                            }
                        </Text>
                        {!!conversation.new > 0 &&
                        <View style={[AppStyles.flex1, AppStyles.rightAligned]}>
                            <View
                                style={[styles.badgeContainer]}
                            ><Text style={[styles.badgeText]}>{ conversation.new }</Text>
                            </View>
                        </View>
                        }
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    render = () => {
        const {conversationsListing} = this.props;
        const {isRefreshing, dataSource, error} = this.state;

        if (error) {return <Error text={error} tryAgain={() => { this.fetchConversations(true); }} />;}

        if (isRefreshing && (!conversationsListing || conversationsListing.length < 1)) {
            return <Loading text='Loading Conversations...' />;
        }

        if (!isRefreshing && (!conversationsListing || conversationsListing.length < 1)) {
            return <Error text='No Message' tryAgain={() => { this.fetchConversations(true); }} />;
        }

        return (
            <ActionSheet ref={(component) => { this.actionSheetRef = component; }}>
                <View style={[AppStyles.container]}>
                    <View style={[AppStyles.row, styles.headerContainer]}>
                        <View style={[AppStyles.flex6]}>
                            <SearchBar
                                lightTheme
                                onChangeText={this.onSearchChange}
                                inputStyle={{height: 38}}
                                containerStyle={{backgroundColor: 'transparent'}}
                                placeholder='Search messages'
                            />
                        </View>
                        <View style={[AppStyles.flex1, AppStyles.centerAligned]}>
                            <Icon
                                name='md-options'
                                type='ionicon'
                                color='grey'
                                size={22}
                                underlayColor='transparent'
                                onPress={this.onPressOptions}
                            />
                        </View>
                    </View>

                    <FlatList
                        renderItem={conversation => this.renderItem(conversation)}
                        data={dataSource}
                        refreshing={isRefreshing}
                        onRefresh={() => { this.fetchConversations(true); }}
                        onEndReached={this.LoadMore}
                        onEndReachedThreshold={100}
                        keyExtractor={item => item.id}
                    />

                </View>
            </ActionSheet>

        );
    }
}

/* Export Component ==================================================================== */
export default ConversationsListing;
