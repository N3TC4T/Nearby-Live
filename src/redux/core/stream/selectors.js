import {createSelector} from 'reselect';
import {createSelector as ormCreateSelector} from 'redux-orm';
import schema from './models';

export const ormSelector = state => state.stream;

export const streamSelector = createSelector(
    ormSelector,
    state => state.stream.selectedSectionIndex,
    ormCreateSelector(schema, (session, selectedIndex) => {
        let Index = selectedIndex ;

        if (!Index) {
            Index = 0;
        }

        if (Index !== 2) {
            return session.Post.all().filter(post => post.section.includes(Index)).orderBy(['date'], 'desc').toRefArray();
        }
        return session.Post.all().filter(post => post.section.includes(Index)).toRefArray();
    }),
);

export const postSelector = createSelector(
    ormSelector,
    (state, props) => props,
    ormCreateSelector(schema, (session, props) => {
        const post = session.Post.withId(props.postID);

        const obj = Object.assign({}, post.ref);

        return Object.assign({}, obj, {
            comments: post.comments.orderBy(['date'], 'desc').toRefArray()
        });
    }),
);

export const userPostsSelector = createSelector(
    ormSelector,
    (state, props) => props,
    ormCreateSelector(schema, (session, props) => session.Post.filter(post => post.pid === props.pid).orderBy(['date'], 'desc').toRefArray()),
);
