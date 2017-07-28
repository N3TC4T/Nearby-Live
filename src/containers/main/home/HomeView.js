/**
 * Main Tabs Screen
 *  - Shows tabs, which contain watched posts, stream and  messages listings
 */
import React, { Component, PropTypes } from 'react';
import {
    Animated,
    View,
    StyleSheet,
    InteractionManager,
} from 'react-native';


// Consts and Libs
import { AppColors } from '@theme/';

// Containers
import StreamListing from '@containers/main/home/stream/StreamContainer';
import ConversationsListing from '@containers/main/home/conversations/ConversationsListingContainer';

// Components
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import { Text, NavIcon } from '@ui/';
import Placeholder from '@components/general/Placeholder';
import Loading from '@components/general/Loading';
import Error from '@components/general/Error';


import {Actions} from 'react-native-router-flux';


/* Styles ==================================================================== */
const styles = StyleSheet.create({
    // Tab Styles
    tabContainer: {
        flex: 1,
    },
    tabbar: {
        backgroundColor: AppColors.tabbarTop.background,
    },
    tabbarIndicator: {
        backgroundColor: AppColors.tabbarTop.indicator,
    },
    tabbarLabel:{
        paddingTop:4,
        paddingBottom:4
    },
    rightNotify: {
        marginTop: 15,
        marginRight: 15,
        backgroundColor: '#f44336',
        height: 5,
        width: 5,
        borderRadius: 12,
        borderColor:'black',
        borderWidth:0.2,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },
    leftNotify: {
        marginTop: 15,
        marginRight: 95,
        backgroundColor: '#f44336',
        height: 5,
        width: 5,
        borderRadius: 12,
        borderColor:'black',
        borderWidth:0.2,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },
});

/* Component ==================================================================== */
class HomeTabs extends Component {
    static componentName = 'HomeTabs';

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            visitedRoutes: [],
        };
    }

    componentDidMount ()  {
        InteractionManager.runAfterInteractions(() => {
            this.setTabs();
            //
            // Actions.userProfileView({
            //     userID: 'EidkMM3HkT1lesFgX39y5Q',
            // });

        });
    };

    componentWillReceiveProps (nextProps){
        if(nextProps.UnseenWatchedCount != this.props.UnseenWatchedCount || nextProps.UnreadMessagesCount != this.props.UnreadMessagesCount){
            this.setState({
                navigation: { ...this.state.navigation, needUpdate:true },
            });
        }
    }

    setTabs = () => {
        const routes = [
            {
                key: '0',
                id: 'watched',
                title:'WATCHED',
            },{
                key: '1',
                id: 'stream',
                title:'STREAM',

            },{
                key: '2',
                id: 'messages',
                title:'MESSAGES',
            }
        ];

        this.setState({
            navigation: {
                index: 1,
                routes,
                needUpdate:false,
            },
        }, () => {
            this.setState({
                loading: false,
            });
        });
    };


    /**
     * On Change Tab
     */
    handleChangeTab = (index) => {
        this.setState({
            navigation: { ...this.state.navigation, index },
        });
    };


    renderBadge = (route) => {
        const { UnreadMessagesCount, UnseenWatchedCount } = this.props

        if (route.index === 2 && UnreadMessagesCount != 0 ) {
            return (
                <View style={styles.rightNotify}/>
            );
        }

        if (route.index === 0 && UnseenWatchedCount != 0 ) {
            return (
                <View style={styles.leftNotify}/>
            );
        }

        return null
    };

    renderLabel = props => ({ route, index }) => {
        const inputRange = props.navigationState.routes.map((x, i) => i);
        const outputRange = inputRange.map(
            inputIndex => (inputIndex === index ? '#FFFFFF' : '#818F92'),
        );
        const color = props.position.interpolate({
            inputRange,
            outputRange,
        });

        return (
            <Animated.Text style={[styles.tabbarLabel, { color }]}>
                {route.title}
            </Animated.Text>
        );
    };

    /**
     * Header Component
     */
    renderHeader = props => (
        <TabBar
            {...props}
            renderBadge={this.renderBadge}
            style={styles.tabbar}
            indicatorStyle={styles.tabbarIndicator}
            labelStyle={styles.tabbarLabel}
            renderLabel={this.renderLabel(props)}
        />
    );

    /**
     * Which component to show
     */
    renderScene = ({ route }) => {
        // For performance, only render if it's this route, or I've visited before
        if (
            parseInt(route.key, 0) !== parseInt(this.state.navigation.index, 0) &&
            this.state.visitedRoutes.indexOf(route.key) < 0
        ) {
            return null;
        }

        // And Add this index to visited routes
        if (this.state.visitedRoutes.indexOf(this.state.navigation.index) < 0) {
            this.state.visitedRoutes.push(route.key);
        }

        // Which component should be loaded?
        switch (route.id) {
            case 'watched':
                return (
                    <View style={styles.tabContainer}>
                        <Placeholder />
                    </View>
                );
            case 'stream' :
                return (
                    <View style={styles.tabContainer}>
                        <StreamListing />
                    </View>
                );
            case 'messages':
                return (
                    <View style={styles.tabContainer}>
                        <ConversationsListing />
                    </View>
                );
            default :
                return (
                    <View />
                );

        }

    }

    render () {
        if (this.state.loading || !this.state.navigation) return <Loading />;
        if (this.state.error) return <Error text={this.state.error} />;

        return (
            <TabViewAnimated
                style={[styles.tabContainer]}
                renderScene={this.renderScene}
                renderHeader={this.renderHeader}
                navigationState={this.state.navigation}
                onRequestChangeTab={this.handleChangeTab}
            />
        );
    }
}

/* Export Component ==================================================================== */
export default HomeTabs;
