import * as React from 'react';
import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../redux/store';
import { ManualsState } from       '../../../redux/states/manualsState';
import { SelectState } from '../../../redux/states/selectState';
import { selectActions } from '../../../redux/actions/selectAction';

import { RouteComponentProps } from 'react-router-dom';
import { baseTreeNode, TreeNode, Tree, Manual } from '../../../data-types/tree';
import TreeUtil from '../../../func/tree';
import TreeNodeUtil from '../../../func/tree-node';

import ViewComponent from './view-component';
import KSize from '../../../data-types/k-size';
import { ksActions } from '../../../redux/actions/ksAction';
import ReadingSetting from '../../../data-types/reading-settings';
import { rsActions } from '../../../redux/actions/rsAction';
import { CategoriesState } from '../../../redux/states/categoriesState';
import User from '../../../data-types/user';

export interface ViewActions {
  setManual: (manual: Manual) => Action<Manual>;
  setNode:   (node: TreeNode) => Action<TreeNode>;
  clearRequest: () => Action<void>;
}

interface Props extends
  ManualsState,
  CategoriesState,
  SelectState,
  ViewActions, RouteComponentProps<{id: string}> {
    user: User;
  }

const ViewContainer: React.FC<Props> = props => {
  const { user, manuals, manual, request, setManual, setNode, clearRequest, match } =  props;

  if (manual === null || manual.id !== match.params.id) {
    var selected;
    selected = TreeUtil._findArray(manuals, match.params.id)
    if (selected === undefined) { throw new Error('Not found the manual.'); }
    setManual(selected);
    const tree = TreeUtil._get<Tree, TreeNode>(selected, baseTreeNode);
    setNode(TreeNodeUtil._init(tree));
    return <p>loading...</p>
  }
  const componentProps = {user, manual, request, clearRequest};
  return <ViewComponent {...componentProps}/>;
}

function mapStateToProps(appState: AppState) {
  return {user: appState.loginUser.user!, ...appState.manuals, ...appState.categories, ...appState.select, ...appState.ks};
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