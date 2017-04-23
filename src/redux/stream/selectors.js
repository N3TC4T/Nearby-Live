import schema from './models'
import { createSelector } from 'reselect';
import { createSelector as ormCreateSelector } from 'redux-orm';


export const ormSelector = state => state.stream;

export const streamSelector = createSelector(
    ormSelector,
    state => state.stream.selectedSectionIndex,
    ormCreateSelector(schema, (session, selectedIndex) => {
        !selectedIndex? selectedIndex = 0 : null

        if (selectedIndex !== 2 ){
            return session.Post.all().filter(post => post.section.includes(selectedIndex)).orderBy(['date'], 'desc').toRefArray()
        }else {
            return session.Post.all().filter(post => post.section.includes(selectedIndex)).toRefArray()
        }


    })
);



export const postSelector = createSelector(
    ormSelector,
    (state, props) => props,
    ormCreateSelector(schema, (session, props) => {
        const post = session.Post.withId(props.postID)

        let obj = Object.assign({}, post.ref);

        return Object.assign({}, obj, {
            comments: post.comments.orderBy(['date'], 'desc').toRefArray(),
        });

    })
);