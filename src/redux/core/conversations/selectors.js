import {createSelector} from 'reselect';
import {createSelector as ormCreateSelector} from 'redux-orm';
import schema from './models';

export const ormSelector = state => state.conversations;

export const conversationsSelector = createSelector(
    ormSelector,
    ormCreateSelector(schema, session => session.Conversation.all().orderBy(['last'], 'desc').toRefArray()),
);

export const conversationSelector = createSelector(
    ormSelector,
    (state, props) => props,
    ormCreateSelector(schema, (session, props) => {
        const conversation = session.Conversation.withId(props.pid);

        const obj = Object.assign({}, conversation.ref);

        return Object.assign({}, obj, {
            messages: conversation.messages.orderBy(['date']).toRefArray(),
            lessParams: {
                last: conversation.messages.count() > 1 ? conversation.messages.orderBy(['date']).first().msgid : null,
                initialized: conversation.initialized,
                id: conversation.id

            }
        });
    }),
);
