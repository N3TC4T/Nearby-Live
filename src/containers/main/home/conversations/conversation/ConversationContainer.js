/**
 * Individual Recipe Card Container
 */
import {connect} from 'react-redux';

import * as ConversationsActions from '@redux/core/conversations/actions';
import {conversationSelector} from '@redux/core/conversations/selectors';

// Components
import ConversationView from './ConversationView';

/* Redux ==================================================================== */
const mapStateToProps = (state, ownProps) => ({
    user: state.user,
    conversation: conversationSelector(state, ownProps)
});

const mapDispatchToProps = {
    getMessages: ConversationsActions.getMessages,
    sendMessage: ConversationsActions.sendMessage
};

const mergeProps = (stateProps, dispatchProps) => ({
    user: stateProps.user,
    conversation: stateProps.conversation,
    getMessages: () => dispatchProps.getMessages(stateProps.conversation.lessParams),
    sendMessage: dispatchProps.sendMessage
});

/* Export Component ==================================================================== */
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ConversationView);
