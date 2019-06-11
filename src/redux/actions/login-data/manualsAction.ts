import actionCreatorFactory from 'typescript-fsa';
import { Manual } from '../../../data-types/tree';

const actionCreator = actionCreatorFactory();

export const manualsAction = {
  change: actionCreator<Manual[]>('ACTIONS_MANUAL_CHANGE'),
  replace: actionCreator<Manual>('ACTIONS_MANUAL_REPLACE'),
};