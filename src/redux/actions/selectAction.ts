import actionCreatorFactory from 'typescript-fsa';
import { Manual, TreeNode, PullRequest } from '../../data-types/tree';

const actionCreator = actionCreatorFactory();

export const selectActions = {
  setManual: actionCreator<Manual>('ACTIONS_MANUAL_SET'),
  setNode: actionCreator<TreeNode>('ACTIONS_TREENODE_SET'),
  setRequest: actionCreator<PullRequest>('ACTIONS_PULLREQEST_SET'),
  clearRequest: actionCreator<void>('ACTIONS_CLEARREQEST_SET'),
  setReqNode: actionCreator<TreeNode>('ACTIONS_REQNODE_SET'),
};