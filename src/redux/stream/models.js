import { ORM } from "redux-orm";
import { attr , many, Model} from 'redux-orm';
import uuid from 'uuid';


/* Models  ==================================================================== */

export class Post extends Model {

    toString() {
        return `Post : ${this.txt}`;
    }

    static get fields() {
        return {
            id:attr({ getDefault: uuid.v4 }),
            comments:many('Comment'),
            section:attr({ getDefault: () => {return []} }),
            cc:attr(),
            d:attr(),
            date:attr(),
            featured:attr(),
            gp:attr(),
            gr:attr(),
            grId:attr(),
            img:attr(),
            lc:attr(),
            lcid:attr(),
            loc:attr(),
            name:attr(),
            new:attr(),
            pImg:attr(),
            pc:attr(),
            pid:attr(),
            t:attr(),
            txt:attr(),
            ul:attr(),
            ur:attr(),
            w:attr(),
        };
    }

    static get modelName() {
        return 'Post';
    }

    static get options() {
        return{
            idAttribute: 'id'
        };
    }
}

export class Comment extends Model {

    toString() {
        return `Comment : ${this.txt}`;
    }

    static get fields() {
        return {
            id:attr({ getDefault: uuid.v4 }),
            cc:attr(),
            d:attr(),
            date:attr({getDefault:() => {new Date().toISOString()}}),
            featured:attr(),
            gp:attr(),
            img:attr(),
            lc:attr(),
            lcid:attr(),
            loc:attr(),
            name:attr(),
            new:attr(),
            pImg:attr(),
            pc:attr(),
            pid:attr(),
            t:attr(),
            txt:attr(),
            ul:attr(),
            ur:attr(),
            w:attr(),
        };
    }

    static get modelName() {
        return 'Comment';
    }

    static get options() {
        return{
            idAttribute: 'id'
        };
    }
}



/* Schema ==================================================================== */

const schema = new ORM();
schema.register(Post, Comment);

/* Export Schema ==================================================================== */

export default schema;