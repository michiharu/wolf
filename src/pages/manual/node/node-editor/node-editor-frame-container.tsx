import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import { AppState } from '../../../../redux/store';
import { Memo } from '../../../../data-types/tree';
import { treeActions } from '../../../../redux/actions/main/manualsAction';
import { memosActions } from '../../../../redux/actions/main/memoAction';
import EditorFrameComponent from './node-editor-frame-component';
import { TreePutRequest } from '../../../../api/definitions';

export interface EditorFrameActions {
  putTree: (params: TreePutRequest) => Action<TreePutRequest>;
  changeMemos: (memos: Memo[]) => Action<Memo[]>;
}

function mapStateToProps(appState: AppState) {
  const { manual, node } = appState.manual;
  return {manual: cloneDeep(manual)!, node: cloneDeep(node)!, ...appState.memos};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    putTree: (params: TreePutRequest) => dispatch(treeActions.put(params)),
    changeMemos:   (memos: Memo[]) => dispatch(memosActions.change(memos)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorFrameComponent);