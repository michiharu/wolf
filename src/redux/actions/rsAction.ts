import actionCreatorFactory from 'typescript-fsa';
import ReadingSetting from '../../data-types/reading-settings';

const actionCreator = actionCreatorFactory();

export const rsActions = {
  change: actionCreator<ReadingSetting>('ACTIONS_RS_CHANGE'),
  reset: actionCreator<void>('ACTIONS_RS_RESET'),
};