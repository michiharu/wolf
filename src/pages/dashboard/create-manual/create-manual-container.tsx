import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../redux/store';
import { manualActions } from '../../../redux/actions/manualAction';
import { Manual } from '../../../data-types/tree';
import CreateManualComponent, { styles } from './create-manual-component';
import { withStyles } from '@material-ui/core';

export interface CreateManualActions {
  changeManuals: (manuals: Manual[]) => Action<Manual[]>;
}

function mapStateToProps(appState: AppState) {
  return {user: appState.loginUser.user!, ...appState.manuals};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    changeManuals: (manuals: Manual[]) => dispatch(manualActions.change(manuals)),
  };
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(CreateManualComponent));
