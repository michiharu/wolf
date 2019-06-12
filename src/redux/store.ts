import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { LoginUserState,  loginUserReducer }    from './states/main/loginUserState';
import { ManualsState, manualsReducer }   from './states/main/manualsState';
import { MemoState, memoReducer } from './states/main/memoState';
import { KSState, ksReducer } from './states/ksState';
import { RSState, rsReducer } from './states/rsState';
import createSagaMiddleware from '@redux-saga/core';
import { rootSaga } from './saga';
import { CategoriesState, categoriesReducer } from './states/main/categoriesState';
import { UsersState, usersReducer } from './states/main/usersState';
import { ViewState, viewReducer } from './states/viewState';
import { NotificationsState, notificationsReducer } from './states/notificationsState';

export type AppState = {
  loginUser: LoginUserState;
  users: UsersState;
  manuals: ManualsState;
  categories: CategoriesState;
  memos: MemoState;
  view: ViewState;
  notifications: NotificationsState;
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
    memos: memoReducer,
    view: viewReducer,
    notifications: notificationsReducer,
    ks: ksReducer,
    rs: rsReducer,
  }),
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga)

export default store;