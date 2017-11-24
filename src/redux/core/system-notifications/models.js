import {ORM, attr, Model} from 'redux-orm';

/* Models  ==================================================================== */

export class Notification extends Model {
    toString() {
        return `Notification : ${this.txt}`;
    }

    static get fields() {
        return {
            id: attr(),
            type: attr(),
            new: attr(),
            param: attr(),
            date: attr(),
            txt: attr(),
            img: attr()
        };
    }

    static get modelName() {
        return 'Notification';
    }

    static get options() {
        return {
            idAttribute: 'id'
        };
    }
}

/* Schema ==================================================================== */

const schema = new ORM();
schema.register(Notification);

/* Export Schema ==================================================================== */

export default schema;
