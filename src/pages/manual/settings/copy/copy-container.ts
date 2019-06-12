import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../../redux/store';
import { Manual } from '../../../../data-types/tree';
import { manualsAction } from '../../../../redux/actions/main/manualsAction';
import CopyComponent from './copy-component';
import { Action } from 'typescript-fsa';

export interface CopyActions {
  add: (manual: Manual) => Action<Manual>;
}

function mapStateToProps(appState: AppState) {
  const { manuals, selectId } = appState.manuals;
  const manual = manuals.find(m => m.id === selectId)!;
  return {...appState.manuals, manual };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    add: (manual: Manual) => dispatch(manualsAction.post(manual)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CopyComponent);