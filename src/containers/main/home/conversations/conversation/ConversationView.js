/**
 * Post View Screen
 *  - The individual post screen
 */
import React, {Component} from "react";
import PropTypes from 'prop-types';

import {
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {ChatRender, Actions, Bubble} from './Render';

import Error from '@components/general/Error';
import Loading from '@components/general/Loading';

// Consts and Libs
import AppAPI from '@lib/api';
import { getImageURL } from '@lib/util'
import { ErrorMessages } from '@constants/';

// Consts and Libs
import { AppSizes, AppColors, AppStyles, AppFonts } from '@theme/';


/* Component ==================================================================== */
class ConversationView extends Component {
    static componentName = 'ConversationView';

    static propTypes = {
        conversation:  PropTypes.object,
        user: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            typingText: null,
            isLoadingEarlier: false,
            isSendingTypingRequest: false,
            error:null
        };

        this._isMounted = false;
        this._onSend = this._onSend.bind(this);
        this._onLoadEarlier = this._onLoadEarlier.bind(this);
        this._onInputTextChanged = this._onInputTextChanged.bind(this);
        this.renderBubble = this.renderBubble.bind(this);
        this.renderFooter = this.renderFooter.bind(this);

        this._isAlright = null;
    }


    componentDidMount = () => {
        this.fetchMessages();
    }

    /**
     * Fetch Chats from API
     */
    fetchMessages = async () => {
        const { getMessages, conversation } = this.props;

        // Forgot to pass conversation id?
        if (!conversation.id) {
            this.setState({
                error: ErrorMessages.missingConversationID,
            });
        }

        await getMessages()
            .then(() => {
                this.setState({
                    error: null,
                });

            })
            .catch((err) => {
                const error = AppAPI.handleError(err);
                this.setState({
                    error,
                });
            });
    };



    componentWillMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    _loadEarlier = () => {
        const { conversation } = this.props;

        if (conversation.messages.length > 1) {
            return conversation.messages.length < conversation.total
        } else {
            return false
        }


    }

    _onLoadEarlier = async() => {
        this.setState({ isLoadingEarlier: true, });

        await this.props.getMessages()
            .then(() => {
                this.setState({
                    isLoadingEarlier: false,
                    error: null,
                });

            }).catch((err) => {
                const error = AppAPI.handleError(err);
                this.setState({
                    isLoadingEarlier: false,
                    error,
                });
            });

    }

    _onSend = (messages = []) => {

        const { conversation } = this.props;

        messages.map((message) => {
            let _message = {
                body:message.text,
                date:message.date ? message.date: null,
                dir:1,
                id:message.id ? message.id : null,
                sent:false,
                unread:true,
            }

            this.props.sendMessage(Object.assign({}, _message), conversation.id)

            //todo: need to catch error and give retry to user
        })
    }


    _onInputTextChanged = (text) => {
        const { isSendingTypingRequest } = this.state

        const { conversation } = this.props;

        !isSendingTypingRequest ? this.setState({isSendingTypingRequest:true}): null

        if (!isSendingTypingRequest) {
            AppAPI.conversations.post({id:conversation.id, action:'typing'})
                .finally(() => {
                    this.setState({
                        isSendingTypingRequest:false
                    })
                })
        }

    }

    renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
          left: {
            backgroundColor: '#e5e5ea',
          }
        }}
            />
        );
    }

    renderFooter(props) {
        if (this.state.typingText) {
            return (
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>
                        {this.state.typingText}
                    </Text>
                </View>
            );
        }
        return null;
    }


    renderActions(props) {
        return  <Actions
            {...props}
        />
    }


    render() {

        const { error  , isLoadingEarlier} = this.state

        const { conversation } = this.props ;

        if ( conversation && error) return <Error text={error} tryAgain={this.fetchMessages} />;

        return (
            <ChatRender
                messages={conversation.messages}
                onSend={this._onSend}
                loadEarlier={ this._loadEarlier() }
                onLoadEarlier={this._onLoadEarlier}
                onInputTextChanged={this._onInputTextChanged}
                isLoadingEarlier={ isLoadingEarlier}
                user={{_id: conversation.id, name:conversation.name, avatar:getImageURL(conversation.img, true)}}
                renderBubble={this.renderBubble}
                renderActions={this.renderActions}
                renderFooter={this.renderFooter}
            />
        );
    }
}

const styles = StyleSheet.create({
    footerContainer: {
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
    },
    footerText: {
        fontSize: 14,
        color: '#aaa',
    },
});


/* Export Component ==================================================================== */
export default ConversationView;
