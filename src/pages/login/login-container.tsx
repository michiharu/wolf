import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../redux/store';
import { loginActions } from '../../redux/actions/loginAction';
import { manualActions } from '../../redux/actions/manualAction';
import LoginComponent from './login-component';
import User from '../../data-types/user';
import { Tree } from '../../data-types/tree-node';

export interface LoginActions {
  login: (user: User) => Action<User>;
  changeManuals: (manuals: Tree[]) => Action<Tree[]>;
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    login: (user: User) => dispatch(loginActions.login(user)),
    changeManuals: (manuals: Tree[]) => dispatch(manualActions.change(manuals)),
  };
}

function mapStateToProps(appState: AppState) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
