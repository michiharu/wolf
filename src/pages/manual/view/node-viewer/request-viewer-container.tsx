import * as React from 'react';
import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../../redux/store';
import { selectActions } from '../../../../redux/actions/selectAction';

import { TreeNode } from '../../../../data-types/tree';
import NodeViewerComponent from './node-viewer-component';

export interface NodeViewerActions {
  setNode:   (node: TreeNode) => Action<TreeNode>;
}

function mapStateToProps(appState: AppState) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    setNode: (node: TreeNode) => dispatch<Action>(selectActions.setNode(node)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NodeViewerComponent);