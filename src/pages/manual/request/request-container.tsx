import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../redux/store';
import { selectActions } from '../../../redux/actions/selectAction';

import { Manual, TreeNode, PullRequest } from '../../../data-types/tree';
import RequestComponent, { styles } from './request-component';
import { withStyles } from '@material-ui/core';
import { manualsAction } from '../../../redux/actions/manualsAction';

export interface RequestActions {
  changeManuals: (manuals: Manual[]) => Action<Manual[]>;
  setManual: (manual: Manual) => Action<Manual>;
  setNode:   (node: TreeNode) => Action<TreeNode>;
  setRequest: (request: PullRequest) => Action<PullRequest>;
  setReqNode: (reqNode: TreeNode) => Action<TreeNode>;
}

function mapStateToProps(appState: AppState) {
  return {
    manuals: appState.manuals.manuals,
    manual: appState.select.manual!,
    node: appState.select.node!,
    request: appState.select.request!,
    reqNode: appState.select.reqNode!,
    ...appState.ks, ...appState.rs
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    changeManuals: (manuals: Manual[]) => dispatch(manualsAction.change(manuals)),
    setManual: (manual: Manual) => dispatch(selectActions.setManual(manual)),
    setNode:   (node: TreeNode) => dispatch(selectActions.setNode(node)),
    setRequest: (request: PullRequest) => dispatch(selectActions.setRequest(request)),
    setReqNode: (reqNode: TreeNode) => dispatch(selectActions.setReqNode(reqNode)),
  };
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(RequestComponent));
