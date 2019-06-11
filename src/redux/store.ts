import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { LoginUserState,  loginUserReducer }    from './states/login-data/loginUserState';
import { ManualsState, manualsReducer }   from './states/login-data/manualsState';
import { MemoState, memoReducer } from './states/login-data/memoState';
import { SelectState, selectReducer } from './states/select/selectState';
import { KSState, ksReducer } from './states/ksState';
import { RSState, rsReducer } from './states/rsState';
import createSagaMiddleware from '@redux-saga/core';
import { rootSaga } from './saga';
import { CategoriesState, categoriesReducer } from './states/login-data/categoriesState';
import { UsersState, usersReducer } from './states/login-data/usersState';
import { ViewState, viewReducer } from './states/viewState';

export type AppState = {
  loginUser: LoginUserState;
  users: UsersState;
  manuals: ManualsState;
  categories: CategoriesState;
  select: SelectState;
  memos: MemoState;
  view: ViewState;
  ks: KSState;
  rs: RSState;
};

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  combineReducers<AppState>({
    loginUser: loginUserReducer,
    users: usersReducer,
    manuals: manualsReducer,
    categories: categoriesReducer,
    select: selectReducer,
    memos: memoReducer,
    view: viewReducer,
    ks: ksReducer,
    rs: rsReducer,
  }),
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga)

export default store;