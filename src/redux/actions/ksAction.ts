import actionCreatorFactory from 'typescript-fsa';
import KSize from '../../data-types/k-size';

const actionCreator = actionCreatorFactory();
export const ACTIONS_KSIZE_CHANGE = 'ACTIONS_KSIZE_CHANGE';
export const ACTIONS_KSIZE_ZOOM_IN = 'ACTIONS_KSIZE_ZOOM_IN';
export const ACTIONS_KSIZE_ZOOM_OUT = 'ACTIONS_KSIZE_ZOOM_OUT';

export const ksActions = {
  change: actionCreator<KSize>(ACTIONS_KSIZE_CHANGE),
  zoomIn: actionCreator<void>(ACTIONS_KSIZE_ZOOM_IN),
  zoomOut: actionCreator<void>(ACTIONS_KSIZE_ZOOM_OUT),
  reset: actionCreator<void>('ACTIONS_KSIZE_RESET'),
};