import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../../redux/store';
import { Manual } from '../../../../data-types/tree';
import { manualsAction } from '../../../../redux/actions/login-data/manualsAction';
import CopyComponent from './copy-component';
import { Action } from 'typescript-fsa';

export interface CopyActions {
  manualUpdate: (manual: Manual) => Action<Manual>;
}

function mapStateToProps(appState: AppState) {
  return {...appState.manuals, select: appState.select.manual!};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    manualUpdate: (manual: Manual) => dispatch(manualsAction.put(manual)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CopyComponent);