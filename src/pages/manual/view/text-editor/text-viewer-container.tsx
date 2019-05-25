import * as React from 'react';
import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../../redux/store';
import { selectActions } from '../../../../redux/actions/selectAction';

import { TreeNode } from '../../../../data-types/tree';
import TextViewerComponent from './text-viewer-component';


export interface NodeViewerActions {
  setNode:   (node: TreeNode) => Action<TreeNode>;
}

function mapStateToProps(appState: AppState) {
  return {node: appState.select.node!};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    setNode: (node: TreeNode) => dispatch<Action>(selectActions.setNode(node)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TextViewerComponent);