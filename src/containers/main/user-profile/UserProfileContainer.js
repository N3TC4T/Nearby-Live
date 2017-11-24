/**
 * UserProfile Container
 */
import {connect} from 'react-redux';

import UserProfileRender from './UserProfileView';

/* Redux ==================================================================== */
const mapStateToProps = state => ({
    user: state.user
});

// Any actions to map to the component?
const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileRender);
