import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../redux/store';
import { loginActions } from '../../redux/actions/loginAction';
import { manualActions } from '../../redux/actions/manualAction';
import LoginComponent from './login-component';
import User from '../../data-types/user';
import { Manual } from '../../data-types/tree';

export interface LoginActions {
  login: (user: User) => Action<User>;
  changeManuals: (manuals: Manual[]) => Action<Manual[]>;
}

function mapStateToProps(appState: AppState) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    login: (user: User) => dispatch(loginActions.login(user)),
    changeManuals: (manuals: Manual[]) => dispatch(manualActions.change(manuals)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
