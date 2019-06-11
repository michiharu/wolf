import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../../redux/store';
import { selectActions } from '../../../../redux/actions/select/selectAction';

import { Manual } from '../../../../data-types/tree';
import TextEditorComponent from './text-editor-component';
import { manualsAction } from '../../../../redux/actions/login-data/manualsAction';
import { viewAction } from '../../../../redux/actions/viewAction';


export interface NodeViewerActions {
  replaceManual: (manual: Manual) => Action<Manual>;
  setSelect: (manual: Manual) => Action<Manual>;
  editEnd: () => Action<void>;

}

function mapStateToProps(appState: AppState) {
  return {manual: appState.select.manual!, node: appState.select.node!, ...appState.ks, ...appState.rs};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    replaceManual: (manual: Manual) => dispatch(manualsAction.replace(manual)),
    setSelect: (manual: Manual) => dispatch(selectActions.set(manual)),
    editEnd: () => dispatch(viewAction.editEnd()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TextEditorComponent);