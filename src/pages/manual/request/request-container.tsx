import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../redux/store';
import { loginActions } from '../../../redux/actions/loginAction';
import { manualActions } from '../../../redux/actions/manualAction';
import { Manual } from '../../../data-types/tree';
import RequestComponent, { styles } from './request-component';
import { withStyles } from '@material-ui/core';

export interface RequestActions {
  changeManuals: (manuals: Manual[]) => Action<Manual[]>;
}

function mapStateToProps(appState: AppState) {
  return {...appState.manuals};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    changeManuals: (manuals: Manual[]) => dispatch(manualActions.change(manuals)),
  };
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(RequestComponent));
