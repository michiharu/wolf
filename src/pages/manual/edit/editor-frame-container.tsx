import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { AppState } from '../../../redux/store';
import { Tree, KTreeNode, Manual } from '../../../data-types/tree';
import { manualActions } from '../../../redux/actions/manualAction';
import { memoActions } from '../../../redux/actions/memoAction';
import EditorFrameComponent, { styles } from './editor-frame-component';

export interface EditorFrameActions {
  changeManuals: (manuals: Manual[]) => Action<Manual[]>;
  changeMemos: (memoList: KTreeNode[]) => Action<KTreeNode[]>;
}

function mapStateToProps(appState: AppState) {
  return {...appState.manuals, ...appState.memos};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    changeManuals: (manuals: Manual[]) => dispatch(manualActions.change(manuals)),
    changeMemos:   (memos: KTreeNode[]) => dispatch(memoActions.change(memos)),
  };
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(EditorFrameComponent));