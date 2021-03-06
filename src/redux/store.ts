import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { LoginUserState,  loginUserReducer }    from './states/main/loginUserState';
import { ManualState, manualReducer }   from './states/main/manualsState';
import { MemosState, memoReducer } from './states/main/memoState';
import { KSState, ksReducer } from './states/ksState';
import { RSState, rsReducer } from './states/rsState';
import createSagaMiddleware from '@redux-saga/core';
import { rootSaga } from './saga';
import { CategoriesState, categoriesReducer } from './states/main/categoriesState';
import { UsersState, usersReducer } from './states/main/usersState';
import { NotificationsState, notificationsReducer } from './states/notificationsState';
import { LoadingState, loadingReducer } from './states/loadingState';
import { UserGroupsState, userGroupsReducer } from './states/main/userGroupsState';
import { TitleCheckState, titleCheckReducer } from './states/titleCheckState';

export type AppState = {
  loading: LoadingState;
  loginUser: LoginUserState;
  users: UsersState;
  userGroups: UserGroupsState;
  manual: ManualState;
  categories: CategoriesState;
  memos: MemosState;
  notifications: NotificationsState;
  titleCheck: TitleCheckState;
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
    manual: manualReducer,
    categories: categoriesReducer,
    memos: memoReducer,
    notifications: notificationsReducer,
    titleCheck: titleCheckReducer,
    ks: ksReducer,
    rs: rsReducer,
  }),
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga)

export default store;