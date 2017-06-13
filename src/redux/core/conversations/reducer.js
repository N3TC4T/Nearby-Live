import schema from "./models";

/**
 * Conversations Reducer
 */

// Set initial state

const initialState = { ...schema.getEmptyState(), UnreadCount:0 };

export default function conversationsReducer(state = initialState, action) {
    switch (action.type) {
        case 'CONVERSATIONS_REPLACE': {

            const session = schema.session(state);
            const { Conversation } = session;


            if (action.data && typeof action.data === 'object') {
                action.data.map(
                    row => {
                        // check if conversation exist update
                        if (Conversation.hasId(row.id)){
                            Conversation.withId(row.id).update(row);
                        }else{ // if not create
                            Conversation.create(row)
                        }
                    }
                );
            }

            return session.state;
        }


        case 'CONVERSATIONS_UNREAD_COUNT_UPDATE':{
            if (typeof action.data === 'number') {
                return {
                    ...state,
                    UnreadCount: action.data
                };
            }

            return state
        }

        case 'CONVERSATIONS_DELETE': {

            const session = schema.session(state);
            const { Conversation } = session;

            Conversation.all().delete();

            return session.state;
        }

        case 'CONVERSATION_DELETE': {

            const session = schema.session(state);
            const { Conversation } = session;

            if (action.id && typeof action.id === 'string'){
                if (Conversation.hasId(action.id)) {
                    Conversation.withId(action.id).delete();
                }

            }

            return session.state;
        }

        case 'CONVERSATION_UNINITIALIZE': {

            const session = schema.session(state);
            const { Conversation } = session;

            if (action.id && typeof action.id === 'string'){
                if (Conversation.hasId(action.id)) {
                    Conversation.withId(action.id).update({ initialized: false, new:0 });
                }

            }

            return session.state;
        }

        case 'MESSAGES_REPLACE': {
            const session = schema.session(state);
            const { Conversation, Message } = session;

            if (action.data && typeof action.data === 'object') {

                const conversation =  Conversation.withId(action.id)
                conversation.update({ initialized: true });

                action.data.map(
                    row => {
                        // check if message exist or not , we dont need duplicate messages , right ?
                        if (!Message.filter({msgid:row.msgid}).exists()) {
                            conversation.messages.add(Message.create(row))
                        }

                    }
                );
            }

            return session.state;
        }

        case 'MESSAGES_READ': {
            const session = schema.session(state);
            const { Conversation } = session;

            if (action.id && typeof action.id === 'string') {

                const conversation =  Conversation.withId(action.id)

                conversation.messages.filter({unread:true}).toModelArray().map(
                    message => {
                        message.update({unread:false})
                    }
                );
            }

            return session.state;
        }

        case 'MESSAGE_SEND':{
            const session = schema.session(state);
            const { Conversation, Message } = session;

            //todo:should create conversation if not exist for new start conversation

            if (action.id && typeof action.id === 'string' && action.data && typeof action.data === 'object'){
                if (Conversation.hasId(action.id)) {
                    const conversation = Conversation.withId(action.id)
                    // create an message and link to conversation
                    conversation.messages.add(Message.create(action.data))
                    // we need to update msg and date for conversation so we don't need to update it from server on conversations list
                    conversation.update({msg:action.data.body , last:new Date().toISOString(), total:conversation.total + 1})

                }

            }

            return session.state;
        }

        case 'MESSAGE_SENT': {

            const session = schema.session(state);
            const { Message } = session;

            // update message to sent and change messageId

            if (action.id && action.msgid){
                if (Message.hasId(action.id)) {
                    Message.withId(action.id).update({ sent: true, msgid: action.msgid });
                }

            }

            return session.state;
        }


        default:
            return state;
    }
}
