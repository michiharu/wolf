import actionCreatorFactory from 'typescript-fsa';
import { Tree } from '../../data-types/tree-node';

const actionCreator = actionCreatorFactory();

export const manualActions = {
  change: actionCreator<Tree[]>('ACTIONS_CHANGE')
};