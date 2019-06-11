import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../../redux/store';
import { KTreeNode, Manual } from '../../../../data-types/tree';
import { manualsAction } from '../../../../redux/actions/login-data/manualsAction';
import { memoActions } from '../../../../redux/actions/login-data/memoAction';
import EditorFrameComponent from './node-editor-frame-component';
import { selectActions } from '../../../../redux/actions/select/selectAction';
import { SelectState } from '../../../../redux/states/select/selectState';
import User from '../../../../data-types/user';
import { viewAction } from '../../../../redux/actions/viewAction';

export interface EditorFrameActions {
  replaceManual: (manual: Manual) => Action<Manual>;
  setSelect: (manual: Manual) => Action<Manual>;
  changeMemos: (memoList: KTreeNode[]) => Action<KTreeNode[]>;
  editEnd: () => Action<void>;

}

interface Props extends
  SelectState,
  EditorFrameActions {
    user: User;
}

function mapStateToProps(appState: AppState) {
  return {...appState.select, ...appState.memos};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    replaceManual: (manual: Manual) => dispatch(manualsAction.put(manual)),
    setSelect: (manual: Manual) => dispatch(selectActions.set(manual)),
    changeMemos:   (memos: KTreeNode[]) => dispatch(memoActions.change(memos)),
    editEnd: () => dispatch(viewAction.editEnd()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorFrameComponent);