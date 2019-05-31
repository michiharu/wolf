import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { AppState } from '../../../redux/store';
import { KTreeNode, Manual } from '../../../data-types/tree';
import { manualsAction } from '../../../redux/actions/manualsAction';
import { memoActions } from '../../../redux/actions/memoAction';
import EditorFrameComponent, { styles } from './editor-frame-component';
import { selectActions } from '../../../redux/actions/selectAction';

export interface EditorFrameActions {
  changeManuals: (manuals: Manual[]) => Action<Manual[]>;
  changeMemos: (memoList: KTreeNode[]) => Action<KTreeNode[]>;
  clearManual: () => Action<void>;
}

function mapStateToProps(appState: AppState) {
  return {...appState.manuals, ...appState.memos};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    changeManuals: (manuals: Manual[]) => dispatch(manualsAction.change(manuals)),
    changeMemos:   (memos: KTreeNode[]) => dispatch(memoActions.change(memos)),
    clearManual: () => dispatch(selectActions.clearManual()),
  };
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(EditorFrameComponent));