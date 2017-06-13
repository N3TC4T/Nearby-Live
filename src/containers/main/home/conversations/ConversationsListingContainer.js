/**
 * Conversations Container
 */
import { connect } from 'react-redux';

// Actions
import * as ConversationsActions from '@redux/core/conversations/actions';

// Selectors
import { conversationsSelector } from "@redux/core/conversations/selectors";

// Render
import ConversationsListingRender from './ConversationsListingView';

/* Redux ==================================================================== */
const mapStateToProps = state => ({
    conversationsListing: conversationsSelector(state),
});

const mapDispatchToProps = {
    getConversations: ConversationsActions.getConversations,
    uninitializeConversation: ConversationsActions.uninitializeConversation,
    deleteConversation: ConversationsActions.deleteConversation,
    deleteConversations:ConversationsActions.deleteConversations,
};


export default connect(mapStateToProps, mapDispatchToProps)(ConversationsListingRender);
