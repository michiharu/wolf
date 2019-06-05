import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../redux/store';
import { KTreeNode, Manual } from '../../../data-types/tree';
import { manualsAction } from '../../../redux/actions/manualsAction';
import { memoActions } from '../../../redux/actions/memoAction';
import EditorFrameComponent from './editor-frame-component';
import { selectActions } from '../../../redux/actions/selectAction';
import { SelectState } from '../../../redux/states/selectState';
import User from '../../../data-types/user';

export interface EditorFrameActions {
  replaceManual: (manual: Manual) => Action<Manual>;
  setSelect: (manual: Manual) => Action<Manual>;
  changeMemos: (memoList: KTreeNode[]) => Action<KTreeNode[]>;
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
    replaceManual: (manual: Manual) => dispatch(manualsAction.replace(manual)),
    setSelect: (manual: Manual) => dispatch(selectActions.set(manual)),
    changeMemos:   (memos: KTreeNode[]) => dispatch(memoActions.change(memos)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorFrameComponent);