import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../../redux/store';
import { selectActions } from '../../../../redux/actions/select/selectAction';

import { TreeNode } from '../../../../data-types/tree';
import NodeViewerComponent from './node-viewer-component';

export interface NodeViewerActions {
  changeNode:   (node: TreeNode) => Action<TreeNode>;
}

function mapStateToProps(appState: AppState) {
  return {node: appState.select.node!, ...appState.ks, ...appState.rs};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    changeNode: (node: TreeNode) => dispatch<Action>(selectActions.changeNode(node)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NodeViewerComponent);