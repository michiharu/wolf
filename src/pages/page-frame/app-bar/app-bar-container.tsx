import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../redux/store';
import { withStyles } from '@material-ui/core';
import User from '../../../data-types/user';
import AppBarComponent from './app-bar-component';

function mapStateToProps(appState: AppState) {
  return {user: appState.loginUser.user!};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppBarComponent);
