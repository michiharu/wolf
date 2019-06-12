import actionCreatorFactory from 'typescript-fsa';
import { Notification } from '../states/notificationsState';

const actionCreator = actionCreatorFactory();

export const notificationsAction = {
  enqueue: actionCreator<Notification>('ACTIONS_NOTIFICATIONS_ENQUEUE'),
  display: actionCreator<void>('ACTIONS_NOTIFICATIONS_DISPLAY'),
  remove: actionCreator<number>('ACTIONS_NOTIFICATIONS_REMOVE'),
};