import { put, call, fork, take } from 'redux-saga/effects';
import { Notification } from './states/notificationsState';
import * as API from '../api/axios-func';
import { ACTIONS_LOGIN } from './actions/loginAction';
import { loginUserAction } from './actions/main/loginUserAction';
import { LoginPostResponse } from '../api/definitions';
import * as ManualAction from './actions/main/manualsAction';
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
      yield put(ManualAction.manualsAction.set(manuals));
      yield put(categoriesAction.set(categories));
    }
  }
}

const getKey = () => new Date().getTime() + Math.random();

function* handleRequestGetManual() {
  while (true) {
    const action = yield take(ManualAction.ACTIONS_MANUAL_GET);
    const beforeId = action.payload.id;
    const data = yield call(API.manualGet, action.payload);
    console.log(data);
    if (data.error === undefined) {
      yield put(ManualAction.manualsAction.getSuccess({ beforeId, manual: data }));
    } else {
      yield put(ManualAction.manualsAction.getError(beforeId));
      const notification: Notification =
        { key: getKey(), variant: 'warning', message: 'マニュアルの読み込みに失敗しました' };
      yield put(notificationsAction.enqueue(notification));

    }
  }
}

function* handleRequestPostManual() {
  while (true) {
    const action = yield take(ManualAction.ACTIONS_MANUAL_POST);
    const beforeId = action.payload.id;
    const data = yield call(API.manualPost, action.payload);
    if (data.error === undefined) {
      yield put(ManualAction.manualsAction.postSuccess({ beforeId, manual: data }));
      const notification: Notification =
        { key: getKey(), variant: 'success', message: 'マニュアルを新規作成しました' };
      yield put(notificationsAction.enqueue(notification));

    } else {
      yield put(ManualAction.manualsAction.postError(beforeId));
      const notification: Notification =
        { key: getKey(), variant: 'warning', message: 'マニュアルの作成に失敗しました' };
      yield put(notificationsAction.enqueue(notification));
    }
  }
}

function* handleRequestPutManual() {
  while (true) {
    const action = yield take(ManualAction.ACTIONS_MANUAL_PUT);
    const beforeId = action.payload.id;
    const data = yield call(API.manualPut, action.payload);
    if (data.error === undefined) {
      yield put(ManualAction.manualsAction.putSuccess({ beforeId, manual: data }));
      const notification: Notification =
        { key: getKey(), variant: 'success', message: 'マニュアルを保存しました' };
      yield put(notificationsAction.enqueue(notification));
    } else {
      yield put(ManualAction.manualsAction.putError(beforeId));
      const notification: Notification =
        { key: getKey(), variant: 'warning', message: 'マニュアルの保存に失敗しました' };
      yield put(notificationsAction.enqueue(notification));

    }
  }
}

function* handleRequestDeleteManual() {
  while (true) {
    const action = yield take(ManualAction.ACTIONS_MANUAL_DELETE);
    const beforeId = action.payload.id;
    const data = yield call(API.manualDelete, action.payload);
    if (data.error === undefined) {
      yield put(ManualAction.manualsAction.deleteSuccess(beforeId));
      const notification: Notification =
        { key: getKey(), variant: 'success', message: 'マニュアルを削除しました' };
      yield put(notificationsAction.enqueue(notification));
    } else {
      yield put(ManualAction.manualsAction.deleteError(beforeId));
      const notification: Notification =
        { key: getKey(), variant: 'warning', message: 'マニュアルの削除に失敗しました' };
      yield put(notificationsAction.enqueue(notification));
    }
  }
}

function* handleRequestPostFavorite() {
  while (true) {
    const action = yield take(ManualAction.ACTIONS_FAVORITE_POST);
    const beforeId = action.payload.manualId;
    const data = yield call(API.favoritePost, action.payload);
    if (data.error === undefined) {
      yield put(ManualAction.favoriteActions.postSuccess(beforeId));
    } else {
      yield put(ManualAction.favoriteActions.postError(beforeId));
      const notification: Notification =
        { key: getKey(), variant: 'warning', message: 'お気に入り登録に失敗しました' };
      yield put(notificationsAction.enqueue(notification));
    }
  }
}

function* handleRequestDeleteFavorite() {
  while (true) {
    const action = yield take(ManualAction.ACTIONS_FAVORITE_DELETE);
    const beforeId = action.payload.manualId;
    const data = yield call(API.favoriteDelete, action.payload);
    if (data.error === undefined) {
      yield put(ManualAction.favoriteActions.deleteSuccess(beforeId));
    } else {
      yield put(ManualAction.favoriteActions.deleteError(beforeId));
      const notification: Notification =
        { key: getKey(), variant: 'warning', message: 'お気に入り解除に失敗しました' };
      yield put(notificationsAction.enqueue(notification));
    }
  }
}

function* handleRequestPostLike() {
  while (true) {
    const action = yield take(ManualAction.ACTIONS_LIKE_POST);
    const beforeId = action.payload.manualId;
    const data = yield call(API.likePost, action.payload);
    if (data.error === undefined) {
      yield put(ManualAction.likeActions.postSuccess(beforeId));
    } else {
      yield put(ManualAction.likeActions.postError(beforeId));
      const notification: Notification =
        { key: getKey(), variant: 'warning', message: 'いいね登録に失敗しました' };
      yield put(notificationsAction.enqueue(notification));
    }
  }
}

function* handleRequestDeleteLike() {
  while (true) {
    const action = yield take(ManualAction.ACTIONS_LIKE_DELETE);
    const beforeId = action.payload.manualId;
    const data = yield call(API.likeDelete, action.payload);
    if (data.error === undefined) {
      yield put(ManualAction.likeActions.deleteSuccess(beforeId));
    } else {
      yield put(ManualAction.likeActions.deleteError(beforeId));
      const notification: Notification =
        { key: getKey(), variant: 'warning', message: 'いいね解除に失敗しました' };
      yield put(notificationsAction.enqueue(notification));
    }
  }
}

function* handleRequestPutTree() {
  while (true) {
    const action = yield take(ManualAction.ACTIONS_TREE_PUT);
    const beforeId = action.payload.manualId;
    const data = yield call(API.treePut, action.payload);
    if (data.error === undefined) {
      yield put(ManualAction.treeActions.putSuccess(beforeId));
      const notification: Notification =
        { key: getKey(), variant: 'success', message: 'マニュアルを保存しました' };
      yield put(notificationsAction.enqueue(notification));
    } else {
      yield put(ManualAction.treeActions.putError(beforeId));
      const notification: Notification =
        { key: getKey(), variant: 'warning', message: 'マニュアルの保存に失敗しました' };
      yield put(notificationsAction.enqueue(notification));
    }
  }
}


export function* rootSaga() {
  yield fork(handleRequestLogin);

  yield fork(handleRequestGetManual);
  yield fork(handleRequestPostManual);
  yield fork(handleRequestPutManual);
  yield fork(handleRequestDeleteManual);

  yield fork(handleRequestPostFavorite);
  yield fork(handleRequestDeleteFavorite);
  
  yield fork(handleRequestPostLike);
  yield fork(handleRequestDeleteLike);

  yield fork(handleRequestPutTree);
}