import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../../redux/store';


import { TreeNode } from '../../../../data-types/tree';
import NodeViewerComponent from './node-viewer-component';
import { manualAction } from '../../../../redux/actions/main/manualsAction';

export interface NodeViewerActions {
  update:   (node: TreeNode) => Action<TreeNode>;
}

function mapStateToProps(appState: AppState) {
  const { node } = appState.manual;
  return {node: node!, ...appState.ks, ...appState.rs};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    update: (node: TreeNode) => dispatch<Action>(manualAction.update(node)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NodeViewerComponent);