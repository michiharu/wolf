import actionCreatorFactory from 'typescript-fsa';
import KSize from '../../data-types/k-size';

const actionCreator = actionCreatorFactory();

export const ksActions = {
  change: actionCreator<KSize>('ACTIONS_KSIZE_CHANGE'),
  reset: actionCreator<void>('ACTIONS_KSIZE_RESET'),
};