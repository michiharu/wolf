import * as React from 'react';
import { Dispatch, Action, AnyAction } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../redux/store';
import { ManualState } from       '../../../redux/states/manualState';
import { SelectState } from '../../../redux/states/selectState';
import { selectActions } from '../../../redux/actions/selectAction';

import { RouteComponentProps } from 'react-router-dom';
import { baseTreeNode, TreeNode, Tree, Manual } from '../../../data-types/tree';
import TreeUtil from '../../../func/tree';
import TreeNodeUtil from '../../../func/tree-node';

import ViewComponent from './view-component';


interface ViewActions {
  setManual: (manual: Manual) => Action<Manual>;
  setNode:   (node: TreeNode) => Action<TreeNode>;
}

interface Props extends
  ManualState,
  SelectState,
  ViewActions, RouteComponentProps<{id: string}> {}

const ViewContainer: React.FC<Props> = props => {
  const { manuals, manual, node, setManual, setNode, match } =  props;
  const manualId = match.params.id;
  if (manual === null || manual.id !== manualId) {
    const selected = TreeUtil._findArray(manuals, match.params.id)!
    setManual(selected);
    const tree = TreeUtil._get<Tree, TreeNode>(selected, baseTreeNode);
    setNode(TreeNodeUtil._init(tree));
    return <p>loading...</p>
  }

  return <ViewComponent manual={manual} />;
}

function mapStateToProps(appState: AppState) {
  return {...appState.manuals, ...appState.select};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    setManual: (manual: Manual) => dispatch<Action>(selectActions.setManual(manual)),
    setNode:   (node: TreeNode) => dispatch<Action>(selectActions.setNode(node)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewContainer);