import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../../redux/store';
import { Manual } from '../../../../data-types/tree';
import { manualsAction } from '../../../../redux/actions/login-data/manualsAction';
import CopyComponent from './copy-component';
import { Action } from 'typescript-fsa';

export interface CopyActions {
  change: (manuals: Manual[]) => Action<Manual[]>;
}

function mapStateToProps(appState: AppState) {
  return {...appState.manuals, select: appState.select.manual!};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    change: (manuals: Manual[]) => dispatch(manualsAction.change(manuals)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CopyComponent);