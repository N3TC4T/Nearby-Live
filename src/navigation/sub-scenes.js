/**
 * Tabs Scenes
 */
import React from 'react';
import {Scene} from 'react-native-router-flux';

// Consts and Libs
import {AppConfig} from '@constants/';

// Components
import {BackButton} from '@components/ui';

// Containers
import UserProfileContainer from '@containers/main/user-profile/UserProfileContainer';
import CommentsContainer from '@containers/main/home/stream/comments/CommentsContainer';
import ConversationContainer from '@containers/main/home/conversations/conversation/ConversationContainer';

/* Routes ==================================================================== */
const scenes = ([

    <Scene
        hideNavBar
        key='userProfileView'
        component={UserProfileContainer}
        title='Profile'
        analyticsDesc={props => `UserProfile: View ${props.userID}`}
    />,

    <Scene
        {...AppConfig.navbarProps}
        renderBackButton={() => (<BackButton />)}
        key='commentsView'
        component={CommentsContainer}
        title='Comments'
        analyticsDesc={props => `CommentsView: View ${props.postID}`}
    />,

    <Scene
        passProps
        {...AppConfig.navbarProps}
        renderBackButton={() => (<BackButton />)}
        key='conversationView'
        component={ConversationContainer}
        analyticsDesc='ConversationView: Chat View Someone'
    />

]);

export default scenes;
