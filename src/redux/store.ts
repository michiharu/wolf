import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { LoginUserState,  loginUserReducer }    from './states/loginUserState';
import { ManualsState, manualsReducer }   from './states/manualsState';
import { MemoState, memoReducer } from './states/memoState';
import { SelectState, selectReducer } from './states/selectState';
import { KSState, ksReducer } from './states/ksState';
import { RSState, rsReducer } from './states/rsState';
import createSagaMiddleware from '@redux-saga/core';
import { rootSaga } from './saga';
import { FollowsState, followsReducer } from './states/followsState';
import { UsersState, usersReducer } from './states/usersState';
import { usersAction } from './actions/usersAction';

export type AppState = {
  loginUser: LoginUserState,
  users: UsersState,
  manuals: ManualsState,
  follows: FollowsState,
  select: SelectState,
  memos: MemoState,
  ks: KSState,
  rs: RSState,
};

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  combineReducers<AppState>({
    loginUser: loginUserReducer,
    users: usersReducer,
    manuals: manualsReducer,
    follows: followsReducer,
    select: selectReducer,
    memos: memoReducer,
    ks: ksReducer,
    rs: rsReducer,
  }),
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga)

export default store;