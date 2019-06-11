import actionCreatorFactory from 'typescript-fsa';
import { KTreeNode } from '../../../data-types/tree';

const actionCreator = actionCreatorFactory();

export const memoActions = {
  change: actionCreator<KTreeNode[]>('ACTIONS_MEMO_CHANGE')
};