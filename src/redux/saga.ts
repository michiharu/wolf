import { put, call, fork, take } from 'redux-saga/effects';
import { Notification } from './states/notificationsState';
import * as API from '../api/axios-func';
import { ACTIONS_LOGIN } from './actions/loginAction';
import { loginUserAction } from './actions/main/loginUserAction';
import { LoginPostResponse } from '../api/definitions';
import { manualsAction, ACTIONS_MANUAL_POST, ACTIONS_MANUAL_PUT, ACTIONS_MANUAL_DELETE, ACTIONS_FAVORITE_POST, favoriteActions, } from './actions/main/manualsAction';
import { usersAction } from './actions/main/usersAction';
import { categoriesAction } from './actions/main/categoriesAction';
import { notificationsAction } from './actions/notificationsAction';
import { loadingActions } from './actions/loadingAction';

function* handleRequestLogin() {
  while (true) {
    const action = yield take(ACTIONS_LOGIN);
    yield put(loadingActions.beginLogin());
    const data = yield call(API.login, action.payload);
    yield put(loadingActions.endLogin());
    if (data.error === undefined) {
      const { user, users, manuals, categories } = data as LoginPostResponse;
      yield put(loginUserAction.set(user));
      yield put(usersAction.change(users));
      yield put(manualsAction.set(manuals));
      yield put(categoriesAction.set(categories));
    }
  }
}

const getKey = () => new Date().getTime() + Math.random();

function* handleRequestPostManual() {
  while (true) {
    const action = yield take(ACTIONS_MANUAL_POST);
    const beforeId = action.payload.id;
    const data = yield call(API.manualPost, action.payload);
    if (data.error === undefined) {
      yield put(manualsAction.postSuccess({beforeId, manual: data}));
      const notification: Notification =
      {key: getKey(), variant: 'success', message: 'マニュアルを新規作成しました'};
      yield put(notificationsAction.enqueue(notification));

    } else {
      yield put(manualsAction.postError(beforeId));
      const notification: Notification =
      {key: getKey(), variant: 'warning', message: 'マニュアルの作成に失敗しました'};
      yield put(notificationsAction.enqueue(notification));
    }
  }
}

function* handleRequestPutManual() {
  while (true) {
    const action = yield take(ACTIONS_MANUAL_PUT);
    const beforeId = action.payload.id;
    const data = yield call(API.manualPut, action.payload);
    if (data.error === undefined) {
      yield put(manualsAction.putSuccess({beforeId, manual: data}));
      const notification: Notification =
      {key: getKey(), variant: 'success', message: 'マニュアルを保存しました'};
      yield put(notificationsAction.enqueue(notification));
    } else {
      yield put(manualsAction.putError(beforeId));
      const notification: Notification =
      {key: getKey(), variant: 'warning', message: 'マニュアルの保存に失敗しました'};
      yield put(notificationsAction.enqueue(notification));

    }
  }
}

function* handleRequestDeleteManual() {
  while (true) {
    const action = yield take(ACTIONS_MANUAL_DELETE);
    const beforeId = action.payload.id;
    const data = yield call(API.manualDelete, action.payload);
    if (data.error === undefined) {
      yield put(manualsAction.deleteSuccess(beforeId));
    } else {
      yield put(manualsAction.deleteError(beforeId));
    }
  }
}

function* handleRequestPostFavorite() {
  while (true) {
    const action = yield take(ACTIONS_FAVORITE_POST);
    const data = yield call(API.favoritePost, action.payload);
    if (data.error === undefined) {
      yield put(favoriteActions.postSuccess());
    } else {
      yield put(favoriteActions.postError());
      const notification: Notification =
      {key: getKey(), variant: 'warning', message: 'お気に入り登録に失敗しました'};
      yield put(notificationsAction.enqueue(notification));
    }
  }
}

export function* rootSaga() {
  yield fork(handleRequestLogin);
  yield fork(handleRequestPostManual);
  yield fork(handleRequestPutManual);
  yield fork(handleRequestDeleteManual);
  yield fork(handleRequestPostFavorite);
}