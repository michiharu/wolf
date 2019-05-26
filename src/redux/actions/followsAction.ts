import actionCreatorFactory from 'typescript-fsa';
import { Manual } from '../../data-types/tree';

const actionCreator = actionCreatorFactory();

export const followsAction = {
  change: actionCreator<Manual[]>('ACTIONS_FOLLOWS_CHANGE')
};