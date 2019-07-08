import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../../redux/store';
import TextEditorComponent from './text-component';
import { treeActions } from '../../../../redux/actions/main/manualsAction';
import { TreePutRequest } from '../../../../api/definitions';


export interface NodeViewerActions {
  putTree: (params: TreePutRequest) => Action<TreePutRequest>;
}

function mapStateToProps(appState: AppState) {
  const { manual, node } = appState.manual;
  return { manual: manual!, node: node!, ...appState.ks, ...appState.rs };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    putTree: (params: TreePutRequest) => dispatch(treeActions.put(params)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TextEditorComponent);