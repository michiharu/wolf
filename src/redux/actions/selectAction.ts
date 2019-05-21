import actionCreatorFactory from 'typescript-fsa';
import { Manual, TreeNode, PullRequest } from '../../data-types/tree';

const actionCreator = actionCreatorFactory();

export const selectActions = {
  setManual: actionCreator<Manual>('ACTIONS_MANUAL_SET'),
  clearManual: actionCreator<void>('ACTIONS_MANUAL_CLEAR'),
  setNode: actionCreator<TreeNode>('ACTIONS_NODE_SET'),
  setRequest: actionCreator<PullRequest>('ACTIONS_PULLREQEST_SET'),
  clearRequest: actionCreator<void>('ACTIONS_PULLREQEST_CLEAR'),
  setReqNode: actionCreator<TreeNode>('ACTIONS_REQNODE_SET'),
};