import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { VariantType } from 'notistack';
import { notificationsAction } from '../actions/notificationsAction';

export interface MyNotification {
  key: number;
  variant: VariantType;
  message: string;
}

export interface NotificationsState {
  enqueue: MyNotification | null;
  dequeue: MyNotification | null;
  displayed: MyNotification[];
}

const initialState: NotificationsState = {
  enqueue: null,
  dequeue: null,
  displayed: [],
};

export const notificationsReducer = reducerWithInitialState(initialState)
.case(
  notificationsAction.enqueue,
  (state, notification) => ({...state, enqueue: notification})
)
.case(
  notificationsAction.display,
  (state) => ({...state, enqueue: null, displayed: state.displayed.concat([state.enqueue!])})
)
.case(
  notificationsAction.dequeue,
  (state, key) => {
    const dequeue = state.displayed.find(d => d.key === key)!
    return {...state, dequeue};
  }
)
.case(
  notificationsAction.dismiss,
  (state) => ({...state, dequeue: null})
)
.case(
  notificationsAction.remove,
  (state, key) => ({...state, displayed: state.displayed.filter(n => n.key !== key)})
)
