import actionCreatorFactory from 'typescript-fsa';
import { Manual } from '../../data-types/tree';

const actionCreator = actionCreatorFactory();

export const manualActions = {
  change: actionCreator<Manual[]>('ACTIONS_MANUAL_CHANGE')
};