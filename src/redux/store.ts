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
import { LoadingState, loadingReducer } from './states/loadingState';
import { UserGroupsState, userGroupsReducer } from './states/main/userGroupsState';

export type AppState = {
  loading: LoadingState;
  loginUser: LoginUserState;
  users: UsersState;
  userGroups: UserGroupsState;
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
    loading: loadingReducer,
    loginUser: loginUserReducer,
    users: usersReducer,
    userGroups: userGroupsReducer,
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