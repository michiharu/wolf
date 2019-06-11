import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { loginActions, LoginInfo } from '../../redux/actions/login-data/loginAction';
import LoginComponent from './login-component';
import { AppState } from '../../redux/store';

export interface LoginActions {
  login: (loginInfo: LoginInfo) => void;
}

function mapStateToProps(appState: AppState) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    login: (loginInfo: LoginInfo) => dispatch(loginActions.login(loginInfo)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
