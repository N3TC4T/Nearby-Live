/**
 * Authenticate Container
 */
import { connect } from 'react-redux';

// Actions
import * as UserActions from '@redux/user/actions';

import AuthenticateRender from './AuthenticateView';


const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = {
  login: UserActions.login,
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticateRender);
