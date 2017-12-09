/**
 * Conversations Listing Screen
 *  - Shows a list of conversations
 */

import moment from 'moment';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Animated,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    InteractionManager
} from 'react-native';

import Interactable from 'react-native-interactable';

// Actions
import {Actions} from 'react-native-router-flux';

// Consts and Libs
import {AppStyles, AppFonts, AppSizes} from '@theme/';
import {getImageURL} from '@lib/util';
import AppAPI from '@lib/api';

// Components
import Error from '@components/general/Error';
import Loading from '@components/general/Loading';
import ActionSheet from '@expo/react-native-action-sheet';
import {Text, Avatar, Icon, SearchBar} from '@components/ui';

/* Styles ==================================================================== */

const styles = StyleSheet.create({
    container: {
        paddingLeft: 19,
        paddingRight: 16,
        paddingVertical: 12,
        flexDirection: 'row'
    },
    content: {
        marginLeft: 16,
        flex: 1
    },
    contentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#f2f2f2'
    },
    headerContainer: {
        backgroundColor: '#FFF',
        borderBottomWidth: 0.8,
        borderColor: '#E9EBEE'
    },
    time: {
        fontSize: AppFonts.base.size * 0.5,
        color: 'grey'
    },
    badgeContainer: {
        width: 17,
        height: 17,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#006e95'
    },
    badgeContainerWrapper: {
        width: 21,
        height: 21,
        borderRadius: 15,
        borderColor: '#009ccb',
        borderWidth: 0.8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: AppFonts.base.size * 0.5,
        fontFamily: AppFonts.base.familyBold
    },

    button: {
        width: 40,
        height: 40
    },
    trashHolder: {
        position: 'absolute',
        top: 0,
        left: AppSizes.screen.width - 155,
        width: AppSizes.screen.width,
        height: 65,
        paddingLeft: 18,
        backgroundColor: '#f8a024',
        justifyContent: 'center'
    },
    bookmarkHolder: {
        position: 'absolute',
        top: 0,
        left: AppSizes.screen.width - 78,
        width: AppSizes.screen.width,
        height: 65,
        paddingLeft: 18,
        backgroundColor: '#4f7db0',
        justifyContent: 'center'
    }
});

/* Component ==================================================================== */
class Row extends Component {
    constructor(props) {
        super(props);
        this._deltaX = new Animated.Value(0);
    }

    static propTypes = {
        onPressDelete: PropTypes.func.isRequired
    };

    render() {
        return (
            <View style={{backgroundColor: '#ceced2'}}>

                <View style={{position: 'absolute', left: 0, right: 0, height: 65}} pointerEvents='box-none'>
                    <Animated.View style={
                        [styles.trashHolder, {
                            transform: [{
                                translateX: this._deltaX.interpolate({
                                    inputRange: [-155, 0],
                                    outputRange: [0, 155]
                                })
                            }]
                        }
                        ]}>
                        <TouchableOpacity onPress={this.props.onPressDelete} style={styles.button}>
                            <Icon
                                name='trash-o'
                                type='font-awesome'
                                color='white'
                                size={32}
                            />
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View style={
                        [styles.bookmarkHolder, {
                            transform: [{
                                translateX: this._deltaX.interpolate({
                                    inputRange: [-155, 0],
                                    outputRange: [0, 78]
                                })
                            }]
                        }
                        ]}>
                        <TouchableOpacity onPress={() => {console.log('not yet');}} style={styles.button}>
                            <Icon
                                name='bookmark-plus-outline'
                                type='material-community'
                                color='white'
                                size={38}
                            />
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                <Interactable.View
                    horizontalOnly={true}
                    snapPoints={[
                        {x: 78, damping: 1 - 1 - 0.7, tension: 300},
                        {x: 0, damping: 1 - 1 - 0.7, tension: 300},
                        {x: -155, damping: 1 - 1 - 0.7, tension: 300}
                    ]}
                    boundaries={{left: -180, right: 0, bounce: 0}}
                    animatedValueX={this._deltaX}>
                    <View style={{left: 0, right: 0, height: 65, backgroundColor: 'white'}}>
                        {this.props.children}
                    </View>
                </Interactable.View>

            </View>
        );
    }
}

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

        const name = conversation.name.replace(/(\r\n|\n|\r)/gm, '');
        let last = '';

        if (conversation.msg.length > 1) {
            if (conversation.msg.includes('[PHOTO-MSG]')) {
                last = '[Picture Message]';
            } else {
                last = conversation.msg.replace(/(\r\n|\n|\r)/gm, '');
            }
        }

        return (
            <Row onPressDelete={() => {this.props.deleteConversation(conversation.id);}}>
                <TouchableOpacity onPress={() => { this.onPressConversation(conversation); }} >
                    <View style={styles.container}>
                        <Avatar source={{uri: getImageURL(conversation.img, true)}} />
                        <View style={styles.content}>
                            <View style={styles.contentHeader}>
                                <Text h5>{name}</Text>
                                <Text style={[styles.time]}>{moment(conversation.last).format('LT')}</Text>
                            </View>
                            <View style={[styles.contentHeader]}>
                                <Text numberOfLines={1} style={[AppStyles.subtext, AppStyles.flex4]}>
                                    {last}
                                </Text>
                                {!!conversation.new > 0 &&
                                <View style={[AppStyles.flex1, AppStyles.rightAligned]}>
                                    <View
                                        style={[styles.badgeContainerWrapper]}
                                    >
                                        <View
                                            style={[styles.badgeContainer]}
                                        ><Text style={[styles.badgeText]}>{ conversation.new }</Text>
                                        </View>
                                    </View>
                                </View>
                                }
                            </View>

                        </View>
                    </View>
                </TouchableOpacity>
            </Row>
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
                        ItemSeparatorComponent={() => { return (<View style={styles.separator}/>); }}
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
