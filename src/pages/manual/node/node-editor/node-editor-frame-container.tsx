import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import { AppState } from '../../../../redux/store';
import { KTreeNode, Manual } from '../../../../data-types/tree';
import { manualsAction } from '../../../../redux/actions/main/manualsAction';
import { memoActions } from '../../../../redux/actions/main/memoAction';
import EditorFrameComponent from './node-editor-frame-component';
import User from '../../../../data-types/user';
import { viewAction } from '../../../../redux/actions/viewAction';

export interface EditorFrameActions {
  replaceManual: (manual: Manual) => Action<Manual>;
  changeMemos: (memoList: KTreeNode[]) => Action<KTreeNode[]>;
  editEnd: () => Action<void>;

}

interface Props extends EditorFrameActions {
    user: User;
}

function mapStateToProps(appState: AppState) {
  const { manuals, selectId, selectNode } = appState.manuals;
  const manual = manuals.find(m => m.id === selectId)!
  return {manual, node: cloneDeep(selectNode!), ...appState.memos};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    replaceManual: (manual: Manual) => dispatch(manualsAction.put(manual)),
    changeMemos:   (memos: KTreeNode[]) => dispatch(memoActions.change(memos)),
    editEnd: () => dispatch(viewAction.editEnd()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorFrameComponent);