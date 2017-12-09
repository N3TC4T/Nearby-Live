/**
 * UserProfile View
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Image,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    InteractionManager,
    findNodeHandle,
    Animated
} from 'react-native';

import {TabViewAnimated, TabBar} from 'react-native-tab-view';
import ActionSheet from '@expo/react-native-action-sheet';
import {Actions} from 'react-native-router-flux';

// Consts and Libs
import {AppColors, AppStyles, AppSizes} from '@theme/';
import {getImageURL} from '@lib/util';
import AppAPI from '@lib/api';

// Components
import {Icon, Badge, Avatar, Text, Pulse} from '@components/ui';

// Renders
import UserInfoRender from '@containers/main/user-profile/Info/UserInfoRender';
import UserPostsRender from '@containers/main/user-profile/Posts/UserPostsContainer';
import UserPhotosRender from '@containers/main/user-profile/Photos/UserPhotosRender';
import UserGiftsRender from '@containers/main/user-profile/Gifts/UserGiftsRender';

/* Constant ==================================================================== */
const HEADER_MAX_HEIGHT = AppSizes.screen.height * 0.49;
const HEADER_ACTION_HEIGHT = 40;
const SLIDE_DURATION = 300;

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    // Tab Styles
    tabContainer: {
        flex: 1
    },
    tabbar: {
        backgroundColor: 'transparent'
    },
    tabbarIndicator: {
        backgroundColor: AppColors.tabbarTop.indicator
    },
    tabbarLabel: {
        paddingTop: 4,
        paddingBottom: 4
    },
    headerContainer: {
        overflow: 'hidden'
    },
    headerBlurImage: {
        position: 'absolute',
        height: HEADER_MAX_HEIGHT + 10,
        width: AppSizes.screen.width,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: -999
    },
    contentContainer: {
        backgroundColor: '#232F3A'
    },
    avatarContainer: {
        position: 'absolute',
        top: AppSizes.screen.height * 0.10,
        left: AppSizes.screen.width * 0.37,
        backgroundColor: 'transparent'
    },
    badgeContainer: {
        position: 'absolute',
        top: AppSizes.screen.height * 0.10,
        left: AppSizes.screen.width * 0.62
    },
    headerActions: {
        position: 'absolute',
        backgroundColor: 'transparent',
        height: HEADER_ACTION_HEIGHT,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        opacity: 1
    },
    overlay: {
        position: 'absolute',
        height: HEADER_ACTION_HEIGHT,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        opacity: 0,
        backgroundColor: '#232F3A',
        zIndex: -997
    },
    overlayBlurImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: -998,
        backgroundColor: 'rgba(0,0,0,.7)'
    }

});

/* Component ==================================================================== */
class AvatarPulseLoader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            circles: []
        };

        this.counter = 1;
        this.setInterval = null;
        this.anim = new Animated.Value(1);
    }

    componentDidMount() {
        this.setCircleInterval();
    }

    componentWillUnmount() {
        clearInterval(this.setInterval);
    }

    setCircleInterval() {
        this.setInterval = setInterval(this.addCircle.bind(this), 2000);
        this.addCircle();
    }

    addCircle() {
        this.setState({circles: [...this.state.circles, this.counter]});
        this.counter += 1;
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: '#232F3A',
                justifyContent: 'center',
                alignItems: 'center'
            }}
            >

                <View style={[styles.headerActions, AppStyles.row]} >

                    <TouchableOpacity
                        onPress={() => { Actions.pop(); }}
                        style={[AppStyles.flex1, AppStyles.leftAligned, AppStyles.paddingSml]}
                    >
                        <Icon name='arrow-left' size={20} type='material-community' color='#dedfe3' />
                    </TouchableOpacity>

                </View>

                {this.state.circles.map(circle => (
                    <Pulse
                        key={circle}
                    />
                ))}

                <Image
                    source={require('../../../assets/image/placeholder.user.png')}
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50
                    }}
                />

                <Text style={{
                    position: 'absolute',
                    top: AppSizes.screen.height * 0.70,
                    color: 'white'
                }}
                >
                            Loading ...
                </Text>
            </View>
        );
    }
}

/* Component ==================================================================== */
class UserProfileRender extends Component {
    static componentName = 'UserProfileRender';

    static propTypes = {
        userID: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            profile: null,
            isLoading: false,
            error: null,
            visitedRoutes: [],
            viewRef: 0,
            headerHeight: new Animated.Value(HEADER_MAX_HEIGHT),
            headerOverlayOpacity: new Animated.Value(0)
        };
    }

    componentWillMount() {
        StatusBar.setHidden(true);
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.fetchUserProfile();
            this.setTabs();
        });
    }

    componentWillUnmount() {
        StatusBar.setHidden(false);
    }

    /* Tab bar and Content ==================================================================== */

    onPressOptions = () => {
        const options = ['Send Message', 'Send GIft', 'Block', 'Report', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        this.actionSheetRef.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex
            },
            (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        console.log('message');
                        break;
                    default:
                }
            },
        );
    }

    setTabs = () => {
        const routes = [
            {
                key: '0',
                id: 'about',
                title: 'About'
            },
            {
                key: '1',
                id: 'recent',
                title: 'Recent'
            }, {
                key: '2',
                id: 'photos',
                title: 'Photos'

            }, {
                key: '3',
                id: 'gifts',
                title: 'Gifts'
            }
        ];

        this.setState({
            navigation: {
                index: 0,
                routes,
                needUpdate: false
            }
        });
    };

    headerImageLoaded() {
        setTimeout(() => {
            this.setState({viewRef: findNodeHandle(this.backgroundImage)});
        }, 30);
    }

    /**
     * On Change Tab
     */
    handleChangeTab = (index) => {
        if (index > 0) {
            if (this.state.headerHeight !== HEADER_ACTION_HEIGHT) {
                Animated.parallel([
                    Animated.spring(
                        this.state.headerHeight,
                        {
                            toValue: HEADER_ACTION_HEIGHT
                        },
                    ),
                    Animated.timing(
                        this.state.headerOverlayOpacity,
                        {
                            toValue: 0.8,
                            duration: SLIDE_DURATION
                        },
                    )
                ]).start();
            }
        } else if (this.state.headerHeight !== HEADER_MAX_HEIGHT) {
            Animated.parallel([
                Animated.spring(
                    this.state.headerHeight,
                    {
                        toValue: HEADER_MAX_HEIGHT
                    },
                ),
                Animated.timing(
                    this.state.headerOverlayOpacity,
                    {
                        toValue: 0,
                        duration: SLIDE_DURATION
                    },
                )
            ]).start();
        }

        this.setState({
            navigation: {...this.state.navigation, index}

        });
    };

    /* Fetch User Profile ==================================================================== */

    fetchUserProfile = () => {
        this.setState({isLoading: true, error: null});

        const {userID} = this.props;

        AppAPI.people.get({id: userID, mini: true})
            .then((res) => {
                this.setState({
                    profile: res,
                    isLoading: false,
                    error: null
                });
            }).catch((err) => {
                const error = AppAPI.handleError(err);
                this.setState({
                    error
                });
            });
    }

    renderContent = () => (
        <View style={[AppStyles.flex1, styles.contentContainer]}>
            <TabViewAnimated
                style={[styles.tabContainer]}
                renderScene={this.renderScene}
                renderHeader={this.renderHeader}
                navigationState={this.state.navigation}
                onIndexChange={this.handleChangeTab}
            />
        </View>
    )

    /**
     * Which component to show
     */
    renderScene = ({route}) => {
        if (
            parseInt(route.key, 0) !== parseInt(this.state.navigation.index, 0) &&
            this.state.visitedRoutes.indexOf(route.key) < 0
        ) {
            return null;
        }

        if (this.state.visitedRoutes.indexOf(this.state.navigation.index) < 0) {
            this.state.visitedRoutes.push(route.key);
        }

        switch (route.id) {
            case 'about':
                return (
                    <View style={styles.tabContainer}>
                        <UserInfoRender profile={this.state.profile} />
                    </View>
                );
            case 'recent':
                return (
                    <View style={styles.tabContainer}>
                        <UserPostsRender pid={this.state.profile.id} />
                    </View>
                );
            case 'photos':
                return (
                    <View style={styles.tabContainer}>
                        <UserPhotosRender pid={this.state.profile.id} />
                    </View>
                );
            case 'gifts':
                return (
                    <View style={styles.tabContainer}>
                        <UserGiftsRender pid={this.state.profile.id} />
                    </View>
                );
            default:
                return (
                    <View />
                );
        }
    }

    /**
     * Header Component
     */
    renderHeader = props => (
        <TabBar
            {...props}
            style={styles.tabbar}
            indicatorStyle={styles.tabbarIndicator}
            renderLabel={this.renderLabel(props)}
        />
    );

    renderLabel = props => ({route, index}) => {
        const inputRange = props.navigationState.routes.map((x, i) => i);
        const outputRange = inputRange.map(inputIndex => (inputIndex === index ? '#FFFFFF' : '#818F92'));
        const color = props.position.interpolate({
            inputRange,
            outputRange
        });

        return (
            <Animated.Text style={{color, fontSize: 13}}>{route.title}</Animated.Text>
        );
    };

    /* Render Other Contents ==================================================================== */

    renderHeaderActions = () => {
        const {headerOverlayOpacity} = this.state;

        return (
            <View>

                <Animated.View style={[styles.overlay, {opacity: headerOverlayOpacity}]} />

                <View style={[styles.headerActions, AppStyles.row]} >

                    <TouchableOpacity
                        onPress={() => { Actions.pop(); }}
                        style={[AppStyles.flex1, AppStyles.leftAligned, AppStyles.paddingSml]}
                    >
                        <Icon name='arrow-left' size={20} type='material-community' color='#dedfe3' />
                    </TouchableOpacity>

                    <View style={[AppStyles.flex1, AppStyles.centerAligned, AppStyles.paddingSml]}>
                        <Text style={{color: '#dedfe3', fontSize: 18}}>Profile</Text>
                    </View>

                    <TouchableOpacity
                        onPress={this.onPressOptions}
                        style={[AppStyles.flex1, AppStyles.rightAligned, AppStyles.paddingSml]}
                    >
                        <Icon name='dots-vertical' size={20} type='material-community' color='#dedfe3' />
                    </TouchableOpacity>
                </View>

            </View>
        );
    }

    renderBadge = () => {
        const {profile} = this.state;

        let badgeName = '';

        if (profile.badges.find(b => b.name === 'Admin')) {
            badgeName = 'admin';
        } else if (profile.badges.find(b => b.name === 'Staff I')) {
            badgeName = 'staff';
        } else if (profile.badges.find(b => b.name === 'VIP')) {
            badgeName = 'vip';
        } else if (profile.badges.find(b => b.name === 'Gold Member')) {
            badgeName = 'gold';
        }

        if (badgeName) {
            return (
                <View style={styles.badgeContainer}>
                    <Badge type={badgeName} />
                </View>
            );
        }
        return null;
    }

    renderHeaderContent = () => {
        const {headerHeight, profile} = this.state;

        return (
            <Animated.View style={[styles.headerContainer, {height: headerHeight}]}>
                <Animated.Image
                    ref={(img) => { this.backgroundImage = img; }}
                    source={{uri: getImageURL(profile.img)}}
                    style={[styles.headerBlurImage]}
                    blurRadius={1}
                    onLoadEnd={this.headerImageLoaded.bind(this)}
                />

                <View
                    style={[styles.overlayBlurImage]}
                />

                <View style={styles.avatarContainer}>
                    <Avatar
                        source={{uri: getImageURL(profile.img, true)}}
                        imgKey={profile.img}
                        size={90}
                    />
                </View>

                {/* Render Badge */}
                {this.renderBadge()}

                <View style={[{marginTop: 160}, AppStyles.row]} >
                    <View style={[AppStyles.flex1, AppStyles.centerAligned]}>
                        <Text style={[{color: '#FFF'}]} h4>{profile.name}</Text>
                        <Text style={{color: '#dedfe3', fontSize: 10, textAlign: 'center'}}>{profile.interest}</Text>
                    </View>
                </View>

                <View style={[AppStyles.row, AppStyles.padding]}>
                    <View style={[AppStyles.flex1, AppStyles.centerAligned]}>
                        {/* <Text style={{color:'#dedfe3'}} h4>{profile.favdby.length}</Text> */}
                        <Text style={{color: '#dedfe3'}} h4>0</Text>
                        <Text style={{color: '#dedfe3'}}>Followers</Text>
                    </View>

                    <View style={[AppStyles.flex1, AppStyles.centerAligned]}>
                        {/* <Text style={{color:'#dedfe3'}} h4>{profile.favs.length}</Text> */}
                        <Text style={{color: '#dedfe3'}} h4>0</Text>
                        <Text style={{color: '#dedfe3'}}>Following</Text>
                    </View>

                </View>
            </Animated.View>

        );
    }

    /* Render Main ==================================================================== */

    render = () => {
        const {isLoading, profile, error} = this.state;

        if (isLoading || !profile) {
            return <AvatarPulseLoader />;
        }

        // Todo: Better error handling
        if (error) {
            return <Text>Cant load Profile</Text>;
        }

        return (
            <ActionSheet ref={(component) => { this.actionSheetRef = component; }}>

                <View style={[AppStyles.flex1]}>

                    {/* Header Actions */}
                    {this.renderHeaderActions()}
                    {/* Header Actions */}

                    {/* Header Content */}
                    {this.renderHeaderContent()}
                    {/* Header Content */}

                    {/* Content */}
                    {this.renderContent()}
                    {/* Content */}
                </View>
            </ActionSheet>

        );
    }
}

/* Export Component ==================================================================== */
export default UserProfileRender;
