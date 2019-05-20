import * as React from 'react';
import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../redux/store';
import { ManualState } from       '../../../redux/states/manualState';
import { SelectState } from '../../../redux/states/selectState';
import { selectActions } from '../../../redux/actions/selectAction';

import { RouteComponentProps } from 'react-router-dom';
import { baseTreeNode, TreeNode, Tree, Manual, PullRequest } from '../../../data-types/tree';
import TreeUtil from '../../../func/tree';
import TreeNodeUtil from '../../../func/tree-node';

import ViewComponent from './view-component';
import KSize from '../../../data-types/k-size';
import { ksActions } from '../../../redux/actions/ksAction';
import ReadingSetting from '../../../data-types/reading-settings';
import { rsActions } from '../../../redux/actions/rsAction';


export interface ViewActions {
  setManual: (manual: Manual) => Action<Manual>;
  setNode:   (node: TreeNode) => Action<TreeNode>;
  clearRequest: () => Action<void>;
}

interface Props extends
  ManualState,
  SelectState,
  ViewActions, RouteComponentProps<{id: string}> {}

const ViewContainer: React.FC<Props> = props => {
  const {
    manuals, manual, request, setManual, setNode, clearRequest,
    match
  } =  props;

  const manualId = match.params.id;
  if (manual === null || manual.id !== manualId) {
    const selected = TreeUtil._findArray(manuals, match.params.id)!
    setManual(selected);
    const tree = TreeUtil._get<Tree, TreeNode>(selected, baseTreeNode);
    setNode(TreeNodeUtil._init(tree));
    return <p>loading...</p>
  }

  return <ViewComponent manual={manual} request={request} clearRequest={clearRequest}/>;
}

function mapStateToProps(appState: AppState) {
  return {...appState.manuals, ...appState.select, ...appState.ks};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    setManual: (manual: Manual) => dispatch(selectActions.setManual(manual)),
    setNode:   (node: TreeNode) => dispatch(selectActions.setNode(node)),
    clearRequest: () => dispatch(selectActions.clearRequest()),
    changeKS:  (ks: KSize) => dispatch(ksActions.change(ks)),
    resetKS:   () => dispatch(ksActions.reset()),
    changeRS:  (rs: ReadingSetting) => dispatch(rsActions.change(rs)),
    resetRS:   () => dispatch(rsActions.reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewContainer);