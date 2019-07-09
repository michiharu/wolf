import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import { AppState } from '../../../redux/store';
import { treeActions } from '../../../redux/actions/main/manualsAction';
import EditorFrameComponent from './node-frame-component';
import { TreePutRequest } from '../../../api/definitions';

export interface EditorFrameActions {
  putTree: (params: TreePutRequest) => Action<TreePutRequest>;
}

function mapStateToProps(appState: AppState) {
  const { manual, node } = appState.manual;
  return {manual: cloneDeep(manual)!, node: cloneDeep(node)!, ...appState.ks};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    putTree: (params: TreePutRequest) => dispatch(treeActions.put(params)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorFrameComponent);