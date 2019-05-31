import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { loginActions, LoginInfo } from '../../redux/actions/loginAction';
import LoginComponent from './login-component';

export interface LoginActions {
  login: (loginInfo: LoginInfo) => void;
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    login: (loginInfo: LoginInfo) => dispatch(loginActions.login(loginInfo)),
  };
}

export default connect(() => {}, mapDispatchToProps)(LoginComponent);
