import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../../redux/store';
import { Manual } from '../../../../data-types/tree';
import { manualsAction } from '../../../../redux/actions/main/manualsAction';
import CopyComponent from './copy-component';
import { Action } from 'typescript-fsa';
import { titleCheckAction } from '../../../../redux/actions/titileCheckAction';

export interface CopyActions {
  copy: (manual: Manual) => Action<Manual>;
}

function mapStateToProps(appState: AppState) {
  const { manuals, selectId } = appState.manuals;
  const manual = manuals.find(m => m.id === selectId)!;
  return {...appState.manuals, manual };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    copy: (manual: Manual) => dispatch(manualsAction.copy(manual)),
    willGenerate: () => dispatch(titleCheckAction.willGenerate()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CopyComponent);