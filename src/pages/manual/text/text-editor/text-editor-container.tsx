import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../../redux/store';

import { Manual } from '../../../../data-types/tree';
import TextEditorComponent from './text-editor-component';
import { manualsAction } from '../../../../redux/actions/main/manualsAction';
import { viewAction } from '../../../../redux/actions/viewAction';


export interface NodeViewerActions {
  replaceManual: (manual: Manual) => Action<Manual>;
  editEnd: () => Action<void>;

}

function mapStateToProps(appState: AppState) {
  const { manuals, selectId, selectNode } = appState.manuals;
  const manual = manuals.find(m => m.id === selectId)!;
  return {manual, node: selectNode!, ...appState.ks, ...appState.rs};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    replaceManual: (manual: Manual) => dispatch(manualsAction.put(manual)),
    editEnd: () => dispatch(viewAction.editEnd()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TextEditorComponent);