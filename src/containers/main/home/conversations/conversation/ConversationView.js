import React, {Component} from 'react';
import PropTypes from 'prop-types';

// Consts and Libs
import {ErrorMessages} from '@constants/';
import Error from '@components/general/Error';
import AppAPI from '@lib/api';

/* Component ==================================================================== */
class ConversationView extends Component {
    static componentName = 'ConversationView';

    static propTypes = {
        conversation: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired,
        sendMessage: PropTypes.func.isRequired,
        getMessages: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            typingText: null,
            isLoadingEarlier: false,
            isSendingTypingRequest: false,
            error: null
        };

        this.isMounted = false;
        this.onSend = this.onSend.bind(this);
        this.onLoadEarlier = this.onLoadEarlier.bind(this);
        this.onInputTextChanged = this.onInputTextChanged.bind(this);

        this.isAlright = null;
    }

    componentWillMount() {
        this.isMounted = true;
    }

    componentDidMount = () => {
        this.fetchMessages();
    }

    componentWillUnmount() {
        this.isMounted = false;
    }

    onLoadEarlier = async() => {
        this.setState({isLoadingEarlier: true});

        await this.props.getMessages()
            .then(() => {
                this.setState({
                    isLoadingEarlier: false,
                    error: null
                });
            }).catch((err) => {
                const error = AppAPI.handleError(err);
                this.setState({
                    isLoadingEarlier: false,
                    error
                });
            });
    };

    onSend = (messages = []) => {
        const {conversation} = this.props;

        messages.map((message) => {
            const tmpMessage = {
                body: message.text,
                date: message.date ? message.date : null,
                dir: 1,
                id: message.id ? message.id : null,
                sent: false,
                unread: true
            };

            this.props.sendMessage(Object.assign({}, tmpMessage), conversation.id);

            return null;

            // todo: need to catch error and give retry to user
        });
    };

    onInputTextChanged = () => {
        const {isSendingTypingRequest} = this.state;

        const {conversation} = this.props;

        if (!isSendingTypingRequest) {
            this.setState({isSendingTypingRequest: true});
        }

        if (!isSendingTypingRequest) {
            AppAPI.conversations.post({id: conversation.id, action: 'typing'})
                .finally(() => {
                    this.setState({
                        isSendingTypingRequest: false
                    });
                });
        }
    };

    loadEarlier = () => {
        const {conversation} = this.props;

        if (conversation.messages.length > 1) {
            return conversation.messages.length < conversation.total;
        }
        return false;
    };

    fetchMessages = async() => {
        const {getMessages, conversation} = this.props;

        // Forgot to pass conversation id?
        if (!conversation.id) {
            this.setState({
                error: ErrorMessages.missingConversationID
            });
        }

        await getMessages()
            .then(() => {
                this.setState({
                    error: null
                });
            })
            .catch((err) => {
                const error = AppAPI.handleError(err);
                this.setState({
                    error
                });
            });
    };

    render() {
        const {error} = this.state;

        const {conversation} = this.props;

        if (conversation && error) {return <Error text={error} tryAgain={this.fetchMessages} />;}

        return (
            <Error text={ErrorMessages.notImplemented} />
        );
    }
}

/* Export Component ==================================================================== */
export default ConversationView;
