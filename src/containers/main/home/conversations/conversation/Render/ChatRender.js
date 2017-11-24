/*  eslint no-param-reassign: "off" */
// Todo: Fix params reassign
/*  eslint react/sort-comp: "off" */
// Todo: Fix me

import React from 'react';
import PropTypes from 'prop-types';
import {
    Animated,
    InteractionManager,
    Platform,
    StyleSheet,
    View
} from 'react-native';

import ActionSheet from '@expo/react-native-action-sheet';
import moment from 'moment/min/moment-with-locales.min';
import uuid from 'uuid';

import ChatNavBar from './NavBar';
import * as utils from './utils';
import Actions from './Actions';
import Avatar from './Avatar';
import Bubble from './Bubble';
import MessageImage from './MessageImage';
import MessageText from './MessageText';
import Composer from './Composer';
import Day from './Day';
import InputToolbar from './InputToolbar';
import LoadEarlier from './LoadEarlier';
import Message from './Message';
import MessageContainer from './MessageContainer';
import Send from './Send';
import Time from './Time';
import AvatarRender from './AvatarRender';

const MIN_COMPOSER_HEIGHT = Platform.select({
    ios: 33,
    android: 41
});
const MAX_COMPOSER_HEIGHT = 100;
const MIN_INPUT_TOOLBAR_HEIGHT = 44;

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

class ChatRender extends React.Component {
    static append(currentMessages = [], messages) {
        if (!Array.isArray(messages)) {
            messages = [messages];
        }
        return messages.concat(currentMessages);
    }

    static prepend(currentMessages = [], messages) {
        if (!Array.isArray(messages)) {
            messages = [messages];
        }
        return currentMessages.concat(messages);
    }

    constructor(props) {
        super(props);

        // default values
        this.isMounted = false;
        this.keyboardHeight = 0;
        this.bottomOffset = 0;
        this.maxHeight = null;
        this.isFirstLayout = true;
        this.locale = 'en';
        this.messagesTmp = [];

        this.state = {
            isInitialized: false, // initialization will calculate maxHeight before rendering
            composerHeight: MIN_COMPOSER_HEIGHT,
            messagesContainerHeight: null,
            typingDisabled: false
        };

        this.onKeyboardWillShow = this.onKeyboardWillShow.bind(this);
        this.onKeyboardWillHide = this.onKeyboardWillHide.bind(this);
        this.onKeyboardDidShow = this.onKeyboardDidShow.bind(this);
        this.onKeyboardDidHide = this.onKeyboardDidHide.bind(this);
        this.onSend = this.onSend.bind(this);
        this.getLocale = this.getLocale.bind(this);
        this.onInputSizeChanged = this.onInputSizeChanged.bind(this);
        this.onInputTextChanged = this.onInputTextChanged.bind(this);
        this.onMainViewLayout = this.onMainViewLayout.bind(this);
        this.onInitialLayoutViewLayout = this.onInitialLayoutViewLayout.bind(this);

        this.invertibleScrollViewProps = {
            inverted: true,
            keyboardShouldPersistTaps: this.props.keyboardShouldPersistTaps,
            onKeyboardWillShow: this.onKeyboardWillShow,
            onKeyboardWillHide: this.onKeyboardWillHide,
            onKeyboardDidShow: this.onKeyboardDidShow,
            onKeyboardDidHide: this.onKeyboardDidHide
        };
    }

    getChildContext() {
        return {
            actionSheet: () => this.actionSheetRef,
            getLocale: this.getLocale
        };
    }

    componentWillMount() {
        this.setIsMounted(true);
        this.initLocale();
        this.initMessages(this.props.messages);
    }

    componentWillUnmount() {
        this.setIsMounted(false);
    }

    componentWillReceiveProps(nextProps = {}) {
        this.initMessages(nextProps.messages);
    }

    onKeyboardWillShow(e) {
        this.setIsTypingDisabled(true);
        this.setKeyboardHeight(e.endCoordinates ? e.endCoordinates.height : e.end.height);
        this.setBottomOffset(this.props.bottomOffset);
        // Todo: Fix me
        // eslint-disable-next-line
        const newMessagesContainerHeight = (this.getMaxHeight() - (this.state.composerHeight + (this.getMinInputToolbarHeight() - MIN_COMPOSER_HEIGHT))) - this.getKeyboardHeight() + this.getBottomOffset();
        if (this.props.isAnimated === true) {
            Animated.timing(this.state.messagesContainerHeight, {
                toValue: newMessagesContainerHeight,
                duration: 210
            }).start();
        } else {
            this.setState({
                messagesContainerHeight: newMessagesContainerHeight
            });
        }
    }

    onKeyboardWillHide() {
        this.setIsTypingDisabled(true);
        this.setKeyboardHeight(0);
        this.setBottomOffset(0);
        const newMessagesContainerHeight = this.getMaxHeight() - (this.state.composerHeight + (this.getMinInputToolbarHeight() - MIN_COMPOSER_HEIGHT));
        if (this.props.isAnimated === true) {
            Animated.timing(this.state.messagesContainerHeight, {
                toValue: newMessagesContainerHeight,
                duration: 210
            }).start();
        } else {
            this.setState({
                messagesContainerHeight: newMessagesContainerHeight
            });
        }
    }

    onKeyboardDidShow(e) {
        if (Platform.OS === 'android') {
            this.onKeyboardWillShow(e);
        }
        this.setIsTypingDisabled(false);
    }

    onKeyboardDidHide(e) {
        if (Platform.OS === 'android') {
            this.onKeyboardWillHide(e);
        }
        this.setIsTypingDisabled(false);
    }

    onInputSizeChanged(size) {
        const newComposerHeight = Math.max(MIN_COMPOSER_HEIGHT, Math.min(MAX_COMPOSER_HEIGHT, size.height));
        // Todo: Fix me
        // eslint-disable-next-line
        const newMessagesContainerHeight = this.getMaxHeight() - this.calculateInputToolbarHeight(newComposerHeight) - this.getKeyboardHeight() + this.getBottomOffset();
        this.setState({
            composerHeight: newComposerHeight,
            messagesContainerHeight: this.prepareMessagesContainerHeight(newMessagesContainerHeight)
        });
    }

    prepareMessagesContainerHeight(value) {
        if (this.props.isAnimated === true) {
            return new Animated.Value(value);
        }
        return value;
    }

    initLocale() {
        if (this.props.locale === null || moment.locales().indexOf(this.props.locale) === -1) {
            this.setLocale('en');
        } else {
            this.setLocale(this.props.locale);
        }
    }

    calculateInputToolbarHeight(newComposerHeight) {
        return newComposerHeight + (this.getMinInputToolbarHeight() - MIN_COMPOSER_HEIGHT);
    }

    resetInputToolbar() {
        if (this.textInput) {
            this.textInput.clear();
        }
        this.setState({
            composerHeight: MIN_COMPOSER_HEIGHT,
            // Todo: Fix me
            // eslint-disable-next-line
            messagesContainerHeight: this.prepareMessagesContainerHeight(this.getMaxHeight() - this.getMinInputToolbarHeight() - this.getKeyboardHeight() + this.props.bottomOffset),
        });
    }

    renderMessages() {
        const AnimatedView = this.props.isAnimated === true ? Animated.View : View;
        return (
            <AnimatedView style={{
                height: this.state.messagesContainerHeight
            }}>
                <MessageContainer
                    {...this.props}

                    invertibleScrollViewProps={this.invertibleScrollViewProps}

                    messages={this.getMessages()}

                    ref={(component) => { this.messageContainerRef = component; }}
                />
                {this.renderChatFooter()}
            </AnimatedView>
        );
    }

    onSend(messages = [], shouldResetInputToolbar = false) {
        if (!Array.isArray(messages)) {
            messages = [messages];
        }

        messages = messages.map(message => ({
            ...message,
            user: this.props.user,
            date: new Date(),
            id: this.props.messageIdGenerator()
        }));

        if (shouldResetInputToolbar === true) {
            this.setIsTypingDisabled(true);
            this.resetInputToolbar();
        }

        this.props.onSend(messages);
        this.scrollToBottom();

        if (shouldResetInputToolbar === true) {
            setTimeout(() => {
                if (this.getIsMounted() === true) {
                    this.setIsTypingDisabled(false);
                }
            }, 100);
        }
    }

    onInputTextChanged(text) {
        if (this.getIsTypingDisabled()) {
            return;
        }
        if (this.props.onInputTextChanged) {
            this.props.onInputTextChanged(text);
        }
        this.setState({text});
    }

    onInitialLayoutViewLayout(e) {
        const {layout} = e.nativeEvent;
        if (layout.height <= 0) {
            return;
        }
        this.setMaxHeight(layout.height);
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                isInitialized: true,
                text: '',
                composerHeight: MIN_COMPOSER_HEIGHT,
                messagesContainerHeight: this.prepareMessagesContainerHeight(this.getMaxHeight() - this.getMinInputToolbarHeight())
            });
        });
    }

    onMainViewLayout(e) {
        if (Platform.OS === 'android') {
            // fix an issue when keyboard is dismissing during the initialization
            const {layout} = e.nativeEvent;
            if (this.getMaxHeight() !== layout.height && this.getIsFirstLayout() === true) {
                this.setMaxHeight(layout.height);
                this.setState({
                    messagesContainerHeight: this.prepareMessagesContainerHeight(this.getMaxHeight() - this.getMinInputToolbarHeight())
                });
            }
        }
        if (this.getIsFirstLayout() === true) {
            this.setIsFirstLayout(false);
        }
    }

    setIsMounted(value) {
        this.isMounted = value;
    }

    setLocale(locale) {
        this.locale = locale;
    }

    getLocale() {
        return this.locale;
    }

    setMessages(messages) {
        this.messagesTmp = messages.sort((a, b) => (new Date(b.date) - new Date(a.date)));
    }

    getMessages() {
        return this.messagesTmp;
    }

    setMaxHeight(height) {
        this.maxHeight = height;
    }

    getMaxHeight() {
        return this.maxHeight;
    }

    setKeyboardHeight(height) {
        this.keyboardHeight = height;
    }

    getKeyboardHeight() {
        return this.keyboardHeight;
    }

    setBottomOffset(value) {
        this.bottomOffset = value;
    }

    getBottomOffset() {
        return this.bottomOffset;
    }

    setIsFirstLayout(value) {
        this.isFirstLayout = value;
    }

    getIsFirstLayout() {
        return this.isFirstLayout;
    }

    initMessages(messages = []) {
        this.setMessages(messages);
    }

    getIsMounted() {
        return this.isMounted;
    }

    getIsTypingDisabled() {
        return this.state.typingDisabled;
    }

    scrollToBottom(animated = true) {
        this.messageContainerRef.scrollTo({
            y: 0,
            animated
        });
    }

    renderInputToolbar() {
        const inputToolbarProps = {
            ...this.props,
            text: this.state.text,
            composerHeight: Math.max(MIN_COMPOSER_HEIGHT, this.state.composerHeight),
            onSend: this.onSend,
            onInputSizeChanged: this.onInputSizeChanged,
            onTextChanged: this.onInputTextChanged,
            textInputProps: {
                ref: (textInput) => { this.textInput = textInput; },
                maxLength: this.getIsTypingDisabled() ? 0 : null
            }
        };
        if (this.getIsTypingDisabled()) {
            inputToolbarProps.textInputProps.maxLength = 0;
        }
        if (this.props.renderInputToolbar) {
            return this.props.renderInputToolbar(inputToolbarProps);
        }
        return (
            <InputToolbar
                {...inputToolbarProps}
            />
        );
    }

    renderChatFooter() {
        if (this.props.renderChatFooter) {
            const footerProps = {
                ...this.props
            };
            return this.props.renderChatFooter(footerProps);
        }
        return null;
    }

    renderLoading() {
        if (this.props.renderLoading) {
            return this.props.renderLoading();
        }
        return null;
    }

    getMinInputToolbarHeight() {
        if (this.props.renderAccessory) {
            return MIN_INPUT_TOOLBAR_HEIGHT * 2;
        }
        return MIN_INPUT_TOOLBAR_HEIGHT;
    }

    setIsTypingDisabled(value) {
        this.setState({
            typingDisabled: value
        });
    }

    render() {
        if (this.state.isInitialized === true) {
            return (
                <ActionSheet ref={(component) => { this.actionSheetRef = component; }}>
                    <View style={styles.container} onLayout={this.onMainViewLayout}>
                        {this.renderMessages()}
                        {this.renderInputToolbar()}
                    </View>
                </ActionSheet>
            );
        }
        return (
            <View style={styles.container} onLayout={this.onInitialLayoutViewLayout}>
                {this.renderLoading()}
            </View>
        );
    }
}

ChatRender.childContextTypes = {
    actionSheet: PropTypes.func,
    getLocale: PropTypes.func
};

ChatRender.defaultProps = {
    messages: [],
    onSend: () => {
    },
    loadEarlier: false,
    onLoadEarlier: () => {
    },
    locale: null,
    isAnimated: Platform.select({
        ios: true,
        android: false
    }),
    keyboardShouldPersistTaps: Platform.select({
        ios: 'never',
        android: 'always'
    }),
    renderAccessory: null,
    renderActions: null,
    renderAvatar: null,
    renderBubble: null,
    renderFooter: null,
    renderChatFooter: null,
    renderMessageText: null,
    renderMessageImage: null,
    renderComposer: null,
    renderCustomView: null,
    renderDay: null,
    renderInputToolbar: null,
    renderLoadEarlier: null,
    renderLoading: null,
    renderMessage: null,
    renderSend: null,
    renderTime: null,
    onInputTextChanged: null,
    user: {},
    bottomOffset: 0,
    isLoadingEarlier: false,
    messageIdGenerator: () => uuid.v4()
};

ChatRender.propTypes = {
    messages: PropTypes.array,
    onSend: PropTypes.func,
    onInputTextChanged: PropTypes.func,
    loadEarlier: PropTypes.bool,
    onLoadEarlier: PropTypes.func,
    locale: PropTypes.string,
    isAnimated: PropTypes.bool,
    renderAccessory: PropTypes.func,
    renderActions: PropTypes.func,
    renderAvatar: PropTypes.func,
    renderBubble: PropTypes.func,
    renderFooter: PropTypes.func,
    renderChatFooter: PropTypes.func,
    renderMessageText: PropTypes.func,
    renderMessageImage: PropTypes.func,
    renderComposer: PropTypes.func,
    renderCustomView: PropTypes.func,
    renderDay: PropTypes.func,
    renderInputToolbar: PropTypes.func,
    renderLoadEarlier: PropTypes.func,
    renderLoading: PropTypes.func,
    renderMessage: PropTypes.func,
    renderSend: PropTypes.func,
    renderTime: PropTypes.func,
    user: PropTypes.object,
    bottomOffset: PropTypes.number,
    isLoadingEarlier: PropTypes.bool,
    messageIdGenerator: PropTypes.func,
    keyboardShouldPersistTaps: PropTypes.oneOf(['always', 'never', 'handled'])
};

export {
    ChatRender,
    ChatNavBar,
    Actions,
    Avatar,
    Bubble,
    MessageImage,
    MessageText,
    Composer,
    Day,
    InputToolbar,
    LoadEarlier,
    Message,
    Send,
    Time,
    AvatarRender,
    utils
};
