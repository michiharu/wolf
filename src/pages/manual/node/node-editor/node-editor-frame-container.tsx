import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import { AppState } from '../../../../redux/store';
import { Memo } from '../../../../data-types/tree';
import { treeActions } from '../../../../redux/actions/main/manualsAction';
import { memosActions } from '../../../../redux/actions/main/memoAction';
import EditorFrameComponent from './node-editor-frame-component';
import { viewAction } from '../../../../redux/actions/viewAction';
import { TreePutRequest } from '../../../../api/definitions';

export interface EditorFrameActions {
  putTree: (params: TreePutRequest) => Action<TreePutRequest>;
  changeMemos: (memos: Memo[]) => Action<Memo[]>;
  editEnd: () => Action<void>;

}

function mapStateToProps(appState: AppState) {
  const { manuals, selectId, selectNode } = appState.manuals;
  const manual = manuals.find(m => m.id === selectId)!
  return {manual, node: cloneDeep(selectNode!), ...appState.memos};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    putTree: (params: TreePutRequest) => dispatch(treeActions.put(params)),
    changeMemos:   (memos: Memo[]) => dispatch(memosActions.change(memos)),
    editEnd: () => dispatch(viewAction.editEnd()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorFrameComponent);