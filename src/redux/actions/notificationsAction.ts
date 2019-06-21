import actionCreatorFactory from 'typescript-fsa';
import { MyNotification } from '../states/notificationsState';

const actionCreator = actionCreatorFactory();

export const notificationsAction = {
  enqueue: actionCreator<MyNotification>('ACTIONS_NOTIFICATIONS_ENQUEUE'),
  display: actionCreator<void>('ACTIONS_NOTIFICATIONS_DISPLAY'),
  dequeue: actionCreator<number>('ACTIONS_NOTIFICATIONS_DEQUEUE'),
  dismiss: actionCreator<void>('ACTIONS_NOTIFICATIONS_DISMISS'),
  remove: actionCreator<number>('ACTIONS_NOTIFICATIONS_REMOVE'),
};