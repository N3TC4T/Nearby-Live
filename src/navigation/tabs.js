/**
 * Tabs Scenes
 */
import React from 'react';
import { Scene } from 'react-native-router-flux';

// Consts and Libs
import { AppConfig } from '@constants/';
import { AppStyles, AppSizes } from '@theme/';

// Components
import { TabIcon } from '@ui/';
import { ChatNavBar } from '@components/advance/chat'


// Scenes
import Placeholder from '@components/general/Placeholder';


// Containers
import Home from '@containers/main/home/HomeContainer';
import CommentsContainer from '@containers/main/home/stream/comments/CommentsContainer';
import ConversationContainer from '@containers/main/home/conversations/conversation/ConversationContainer';


const navbarPropsTabs = {
    ...AppConfig.navbarProps,
    sceneStyle: {
        ...AppConfig.navbarProps.sceneStyle,
        paddingBottom: AppSizes.tabbarHeight,
    },
};

/* Routes ==================================================================== */
const scenes = (
    <Scene key={'tabBar'} tabs tabBarIconContainerStyle={AppStyles.tabbar} pressOpacity={0.95}>
        <Scene
            hideNavBar
            key={'home'}
            icon={props => TabIcon({ ...props, icon: 'home', size:22, type:'simple-line-icon' })}
        >
            <Scene
                hideNavBar
                key={'main'}
                component={Home}
                title={AppConfig.appName}
                analyticsDesc={'Home: Main'}
            />

            <Scene
                hideTabBar
                {...AppConfig.navbarProps}
                key={'commentsView'}
                component={CommentsContainer}
                title={'Comments'}
                analyticsDesc={'CommentsView: View Comments'}
            />

            <Scene
                hideTabBar
                passProps
                { ...AppConfig.navbarProps }
                key={'conversationView'}
                component={ ConversationContainer }
                navBar={ ChatNavBar }
                analyticsDesc={'conversationView: Chat View Someone'}
            />

        </Scene>


        <Scene
            key={'people'}
            hideNavBar
            component={Placeholder}
            text={'People'}
            icon={props => TabIcon({ ...props, icon: 'people', size:22, type:'simple-line-icon' })}
            analyticsDesc={'People: People'}
        />
        <Scene
            key={'new-post'}
            hideNavBar
            component={Placeholder}
            text={'Add New Post'}
            icon={props => TabIcon({ ...props, icon: 'ios-add-circle-outline', size:40, type:'ionicon' })}
            analyticsDesc={'Posts: New'}
        />
        <Scene
            key={'notifications'}
            hideNavBar
            component={Placeholder}
            text={'Notifications'}
            icon={props => TabIcon({ ...props, icon: 'bell', size:22, type:'simple-line-icon' })}
            analyticsDesc={'Notifications: Notifications'}
        />
        <Scene
            key={'profile'}
            hideNavBar
            component={Placeholder}
            text={'Profile'}
            icon={props => TabIcon({ ...props, icon: 'settings', type:'octicon' })}
            analyticsDesc={'Profile: Profile'}
        />


    </Scene>
);

export default scenes;
