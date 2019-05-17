import actionCreatorFactory from 'typescript-fsa';
import { Manual, TreeNode } from '../../data-types/tree';

const actionCreator = actionCreatorFactory();

export const selectActions = {
  setManual: actionCreator<Manual>('ACTIONS_MANUAL_SET'),
  setNode: actionCreator<TreeNode>('ACTIONS_TREENODE_SET'),
};