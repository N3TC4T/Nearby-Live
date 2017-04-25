import schema from "./models";

/**
 * Stream Reducer
 */

// Set initial state
const initialState = schema.getEmptyState();

export default function streamReducer(state = initialState, action) {
    switch (action.type) {

        case 'SECTION_INDEX_UPDATE': {

            let selectedSectionIndex = 0

            if (action.section && typeof action.section === 'number') {
                selectedSectionIndex = action.section
            }

            return {
                ...state,
                selectedSectionIndex,
            };
        }

        /* Posts ==================================================================== */

        case 'POSTS_UPDATE': {
            const session = schema.session(state);
            const { Post } = session;

            if (action.data && typeof action.data === 'object') {
                action.data.map(
                    row => {
                        // check if post not exist then create
                        if (!Post.hasId(row.id)) {
                            Post.create(Object.assign(row, {section:[action.section]}))
                        }else {
                            const post = Post.withId(row.id)
                            !post.section.includes(action.section)? post.update({section: post.section.concat([action.section]) }) : null
                        }
                    }
                );
            }

            return session.state;
        }

        case 'POST_LIKE': {
            const session = schema.session(state);
            const { Post } = session;

            if (action.id && typeof action.id === 'number') {
                const post = Post.withId(action.id)
                post.update({gp:true, pc: post.pc+1})
            }

            return session.state;
        }

        case 'POST_FEATURE': {
            const session = schema.session(state);
            const { Post } = session;

            if (action.id && typeof action.id === 'number') {
                const post = Post.withId(action.id)
                post.update({featured:true})
            }

            return session.state;
        }

        case 'POST_WATCH': {
            const session = schema.session(state);
            const { Post } = session;

            if (action.id && typeof action.id === 'number') {
                const post = Post.withId(action.id)
                post.update({w:true})
            }

            return session.state;
        }


        case 'POST_UNWATCH': {
            const session = schema.session(state);
            const { Post } = session;

            if (action.id && typeof action.id === 'number') {
                const post = Post.withId(action.id)
                post.update({w:false})
            }

            return session.state;
        }

        case 'POST_DELETE': {
            const session = schema.session(state);
            const { Post } = session;

            if (action.id && typeof action.id === 'number') {
                Post.withId(action.id).delete()
            }

            return session.state;
        }

        case 'POST_REPORT': {
            const session = schema.session(state);
            const { Post } = session;

            if (action.id && typeof action.id === 'number') {
                const post = Post.withId(action.id)
                post.update({reported:true})
            }

            return session.state;
        }

        /* Comments ==================================================================== */

        case 'COMMENTS_UPDATE': {
            const session = schema.session(state);
            const { Post, Comment } = session;

            if (action.data && typeof action.data === 'object' && action.id && typeof action.id === 'number') {

                const post = Post.withId(action.id)

                action.data.map(
                    row => {
                        // check if comment is not in post comments then create
                        if (!Comment.hasId(row.id)) {
                            post.comments.add(Comment.create(row))
                        }
                    }
                );

                // update post comment counts if its changed
                post.cc != action.data.length ? post.update({cc: action.data.length }) : null
            }

            return session.state;
        }

        case 'COMMENTS_ADD': {
            const session = schema.session(state);
            const { Post, Comment } = session;

            if (action.data && typeof action.data === 'object' && action.id && typeof action.id === 'number') {

                const post = Post.withId(action.id)

                // we have problem here if with don't get comment id from http response , then on comment refresh we have duplicated comment

                // post.comments.add(Comment.create(action.data))

                // update post comment counts +1
                post.update({cc: post.cc + 1 })
            }

            return session.state;
        }

        default:
            return state;
    }
}
