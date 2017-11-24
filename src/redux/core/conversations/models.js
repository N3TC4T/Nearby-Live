import {ORM} from 'redux-orm';
import {attr, many, Model} from 'redux-orm';
import uuid from 'uuid';

/* Models  ==================================================================== */

export class Message extends Model {
    toString() {
        return `Message : ${this.body}`;
    }

    static get fields() {
        return {
            body: attr(),
            date: attr(),
            dir: attr(),
            id: attr({getDefault: uuid.v4}),
            msgid: attr(),
            sent: attr({getDefault: () => true}),
            unread: attr({getDefault: () => true})
        };
    }

    static get modelName() {
        return 'Message';
    }

    static get options() {
        return {
            idAttribute: 'id'
        };
    }
}

export class Conversation extends Model {
    toString() {
        return `Conversation: ${this.name}`;
    }

    static get fields() {
        return {
            id: attr(),
            messages: many('Message'),
            gold: attr(),
            img: attr(),
            last: attr(),
            lastid: attr(),
            msg: attr(),
            name: attr(),
            new: attr(),
            staff: attr(),
            total: attr(),
            initialized: attr({getDefault: false})
        };
    }

    static get modelName() {
        return 'Conversation';
    }

    static get options() {
        return {
            idAttribute: 'id'
        };
    }
}

/* Schema ==================================================================== */

const schema = new ORM();
schema.register(Message, Conversation);

/* Export Schema ==================================================================== */

export default schema;
