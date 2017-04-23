/**
 * Home Tabs Container
 */
import { connect } from 'react-redux';

// Actions
import * as StreamActions from '@redux/stream/actions';

// The component we're mapping to
import HomeTabsRender from './HomeView';

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
  // tabs: state.posts.tabs,
});

// Any actions to map to the component?
const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeTabsRender);
