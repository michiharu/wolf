import actionCreatorFactory from 'typescript-fsa';
import { Manual, TreeNode } from '../../../data-types/tree';

const actionCreator = actionCreatorFactory();

export const selectActions = {
  set: actionCreator<Manual>('ACTIONS_SELECT_SET'),
  changeNode: actionCreator<TreeNode>('ACTIONS_CHANGE_SELECTED_NODE'),
  clear: actionCreator<void>('ACTIONS_SELECT_CLEAR'),
};