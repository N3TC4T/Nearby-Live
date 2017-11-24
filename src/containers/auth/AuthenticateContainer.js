/**
 * Authenticate Container
 */
import {connect} from 'react-redux';

// Actions
import * as UserActions from '@redux/core/user/actions';

import AuthenticateRender from './AuthenticateView';

const mapStateToProps = state => ({
    user: state.user
});

const mapDispatchToProps = {
    emailLogin: UserActions.emailLogin,
    facebookLogin: UserActions.facebookLogin
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticateRender);
