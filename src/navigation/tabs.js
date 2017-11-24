/**
 * Tabs Scenes
 */
import React from 'react';
import {Scene} from 'react-native-router-flux';

// Consts and Libs
import {AppConfig} from '@constants/';
import {AppStyles, AppSizes, AppColors} from '@theme/';

// Components
import {TabIcon} from '@ui/';

// Scenes
import Placeholder from '@components/general/Placeholder';

// Containers
import Home from '@containers/main/home/HomeContainer';
import SystemNotificationsContainer from '@containers/main/system-notifications/SystemNotificationsContainer';

const sceneStyleProps = {
    sceneStyle: {
        backgroundColor: AppColors.background,
        paddingBottom: AppSizes.tabbarHeight
    }
};

/* Routes ==================================================================== */
const scenes = (
    <Scene key='tabBar' tabs tabBarIconContainerStyle={AppStyles.tabbar} pressOpacity={0.95}>

        <Scene
            {...sceneStyleProps}
            hideNavBar
            key='home'
            icon={props => <TabIcon {...props} title='Home' icon='home' size={22} type='material-icons' />}
            component={Home}
            title={AppConfig.appName}
            analyticsDesc='Home: Main'
        />

        <Scene
            {...sceneStyleProps}
            key='people'
            hideNavBar
            component={Placeholder}
            text='people'
            icon={props => <TabIcon {...props} title='Explore' icon='explore' size={22} type='material-icons' />}
            analyticsDesc='People: People'
        />

        <Scene
            {...sceneStyleProps}
            key='new-post'
            hideNavBar
            component={Placeholder}
            text='Add New Post'
            icon={props => <TabIcon {...props} raised icon='add' size={20} type='material-icons' />}
            analyticsDesc='Posts: New'
        />

        <Scene
            {...sceneStyleProps}
            key='notifications'
            hideNavBar
            component={SystemNotificationsContainer}
            icon={props => <TabIcon {...props} tabType='notification-system' title='Notifications' icon='notifications' size={22} type='material-icons' />}
            analyticsDesc='SystemNotifications: Notifications-List'
        />

        <Scene
            {...sceneStyleProps}
            key='profile'
            hideNavBar
            component={Placeholder}
            text='Profile'
            icon={props => <TabIcon {...props} title='Profile' icon='person' size={22} type='material-icons' />}
            analyticsDesc='Profile: Profile'
        />

    </Scene>
);

export default scenes;
