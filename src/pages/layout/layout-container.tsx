import { connect } from 'react-redux';
import { AppState } from '../../redux/store';
import AppFrameComponent from './layout-component';
import { Dispatch } from 'redux';
import { Action } from 'typescript-fsa';
import { loginActions } from '../../redux/actions/loginAction';

export interface LayoutActions {
  logout: () => Action<void>;
}

function mapStateToProps(appState: AppState) {
  return {user: appState.loginUser.user!, ...appState.categories};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    logout: () => dispatch(loginActions.logout()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppFrameComponent);
