import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { VariantType } from 'notistack';
import { notificationsAction } from '../actions/notificationsAction';

export interface Notification {
  key: number;
  variant: VariantType;
  message: string;
}

export interface NotificationsState {
  queue: Notification | null;
  displayed: Notification[];
}

const initialState: NotificationsState = {
  queue: null,
  displayed: [],
};

export const notificationsReducer = reducerWithInitialState(initialState)
.case(
  notificationsAction.enqueue,
  (state, notification) => ({...state, queue: notification})
)
.case(
  notificationsAction.display,
  (state) => ({...state, queue: null, displayed: state.displayed.concat([state.queue!])})
)
.case(
  notificationsAction.remove,
  (state, key) => ({...state, displayed: state.displayed.filter(n => n.key !== key)})
)
