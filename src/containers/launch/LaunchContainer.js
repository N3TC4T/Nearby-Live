/**
 * Launch Screen Container
 */
import { connect } from 'react-redux';

// Actions
import * as UserActions from '@redux/core/user/actions';

// The component we're mapping to
import AppLaunchRender from './LaunchView';

// What data from the store shall we send to the component?
const mapStateToProps = () => ({
});

// Any actions to map to the component?
const mapDispatchToProps = {
    getLoginStatus: UserActions.getLoginStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppLaunchRender);
