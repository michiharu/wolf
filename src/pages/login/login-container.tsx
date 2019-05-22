import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../redux/store';
import { loginActions, LoginInfo } from '../../redux/actions/loginAction';
import { manualActions } from '../../redux/actions/manualAction';
import LoginComponent from './login-component';
import User from '../../data-types/user';
import { Manual } from '../../data-types/tree';

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
