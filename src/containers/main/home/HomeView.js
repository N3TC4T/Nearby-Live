/**
 * Main Tabs Screen
 *  - Shows tabs, which contain watched posts, stream and  messages listings
 */
import React, { Component, PropTypes } from 'react';
import {
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

    componentDidMount = () => {
        InteractionManager.runAfterInteractions(() => {
            this.setTabs();
        });
    };


    setTabs = () => {
        const routes = [
            {
                key: '0',
                id: 'watched',
                title:'watched'
            },{
                key: '1',
                id: 'stream',
                title:'stream'
            },{
                key: '2',
                id: 'messages',
                title:'messages'
            }
        ];

        this.setState({
            navigation: {
                index: 1,
                routes,
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

    /**
     * Header Component
     */
    renderHeader = props => (
        <TabBar
            {...props}
            style={styles.tabbar}
            indicatorStyle={styles.tabbarIndicator}
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

    render = () => {
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
