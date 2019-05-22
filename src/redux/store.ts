import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { LoginUserState,  loginUserReducer }    from './states/loginUserState';
import { ManualState, manualReducer }   from './states/manualState';
import { MemoState, memoReducer } from './states/memoState';
import { SelectState, selectReducer } from './states/selectState';
import { KSState, ksReducer } from './states/ksState';
import { RSState, rsReducer } from './states/rsState';
import createSagaMiddleware from '@redux-saga/core';
import { rootSaga } from './saga';

export type AppState = {
  loginUser: LoginUserState,
  manuals: ManualState,
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
    manuals: manualReducer,
    select: selectReducer,
    memos: memoReducer,
    ks: ksReducer,
    rs: rsReducer,
  }),
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga)

export default store;