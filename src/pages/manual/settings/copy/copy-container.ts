import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../../redux/store';
import { Manual } from '../../../../data-types/tree';
import { manualAction } from '../../../../redux/actions/main/manualsAction';
import CopyComponent from './copy-component';
import { Action } from 'typescript-fsa';

export interface CopyActions {
  copy: (manual: Manual) => Action<Manual>;
}

function mapStateToProps(appState: AppState) {
  const { manual } = appState.manual;
  return {...appState.manual, manual: manual!, ...appState.titleCheck };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    copy: (manual: Manual) => dispatch(manualAction.copy(manual)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CopyComponent);