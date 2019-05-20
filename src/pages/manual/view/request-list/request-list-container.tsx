import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../../redux/store';
import { selectActions } from '../../../../redux/actions/selectAction';

import { PullRequest, TreeNode } from '../../../../data-types/tree';
import RequestListComponent from './request-list-component';
import { Action } from 'typescript-fsa';

export interface RequestListActions {
  setRequest: (request: PullRequest) => Action<PullRequest>;
  setReqNode: (reqNode: TreeNode) => Action<TreeNode>;
}

function mapStateToProps(appState: AppState) {
  return {manual: appState.select.manual!};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    setRequest: (request: PullRequest) => dispatch(selectActions.setRequest(request)),
    setReqNode: (reqNode: TreeNode) => dispatch(selectActions.setReqNode(reqNode)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestListComponent);