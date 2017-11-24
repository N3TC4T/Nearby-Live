/**
 * Home Tabs Container
 */
import {connect} from 'react-redux';

// The component we're mapping to
import HomeTabsRender from './HomeView';

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
    UnreadMessagesCount: state.conversations.UnreadCount,
    UnseenWatchedCount: state.stream.UnreadCount
});

// Any actions to map to the component?
const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeTabsRender);
