import { put, call, fork, take } from 'redux-saga/effects';
import { MyNotification } from './states/notificationsState';
import * as API from '../api/axios-func';
import { ACTIONS_LOGIN, ACTIONS_LOGOUT } from './actions/loginAction';
import { loginUserAction, ACTIONS_LOGINUSER_PUT } from './actions/main/loginUserAction';
import { LoginPostResponse, TreePutRequest } from '../api/definitions';
import * as ManualAction from './actions/main/manualsAction';
import { usersAction } from './actions/main/usersAction';
import { categoriesAction } from './actions/main/categoriesAction';
import { notificationsAction } from './actions/notificationsAction';
import { loadingActions } from './actions/loadingAction';
import { Manual } from '../data-types/tree';
import TreeUtil from '../func/tree';
import { userGroupsAction } from './actions/main/userGroupsAction';

export const getKey = () => new Date().getTime() + Math.random();

function* handleRequestLogin() {
  while (true) {
    const action = yield take(ACTIONS_LOGIN);
    yield put(loadingActions.beginLogin());
    const data = yield call(API.login, action.payload);
    yield put(loadingActions.endLogin());
    if (data.error === undefined) {
      const { user, users, userGroups, manuals, categories } = data as LoginPostResponse;
      yield put(loginUserAction.set(user));
      yield put(usersAction.change(users));
      yield put(userGroupsAction.change(userGroups));
      yield put(ManualAction.manualsAction.set(manuals));
      yield put(categoriesAction.set(categories));
    }
  }
}

function* handleRequestLogout() {
  while (true) {
    yield take(ACTIONS_LOGOUT);

    const key = getKey();
    const notification: MyNotification = { key, variant: 'info', message: 'ログアウトしています..' };
    yield put(notificationsAction.enqueue(notification));

    const data = yield call(API.logout);
    yield put(notificationsAction.dequeue(key));
    
    if (data.error === undefined) {
      yield put(loginUserAction.reset());
      const notification: MyNotification =
        { key: getKey(), variant: 'success', message: 'ログアウトしました' };
      yield put(notificationsAction.enqueue(notification));
    } else {
      const notification: MyNotification =
      { key: getKey(), variant: 'warning', message: 'ログアウトに失敗しました' };
      yield put(notificationsAction.enqueue(notification));
    }
  }
}

function* handleRequestPutLoginUser() {
  while (true) {
    const action = yield take(ACTIONS_LOGINUSER_PUT);
    yield put(loadingActions.beginLogin());
    const data = yield call(API.loginUserPut, action.payload);
    yield put(loadingActions.endLogin());
    if (data.error === undefined) {
      yield put(loginUserAction.putSuccess());
      const notification: MyNotification =
        { key: getKey(), variant: 'success', message: 'プロフィールを更新しました' };
      yield put(notificationsAction.enqueue(notification));
    } else {
      yield put(loginUserAction.putError());
      const notification: MyNotification =
        { key: getKey(), variant: 'warning', message: 'プロフィールの更新に失敗しました' };
      yield put(notificationsAction.enqueue(notification));
    }
  }
}

function* handleRequestGetManual() {
  while (true) {
    const action = yield take(ManualAction.ACTIONS_MANUAL_GET);
    const data = yield call(API.manualGet, action.payload);
    if (data.error === undefined) {
      yield put(ManualAction.manualsAction.getSuccess(data));
    } else {
      yield put(ManualAction.manualsAction.getError());
      const notification: MyNotification =
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
      const notification: MyNotification =
        { key: getKey(), variant: 'success', message: 'マニュアルを新規作成しました' };
      yield put(notificationsAction.enqueue(notification));

    } else {
      yield put(ManualAction.manualsAction.postError(beforeId));
      const notification: MyNotification =
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
      const notification: MyNotification =
        { key: getKey(), variant: 'success', message: 'マニュアルを保存しました' };
      yield put(notificationsAction.enqueue(notification));
    } else {
      yield put(ManualAction.manualsAction.putError(beforeId));
      const notification: MyNotification =
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
      const notification: MyNotification =
        { key: getKey(), variant: 'success', message: 'マニュアルを削除しました' };
      yield put(notificationsAction.enqueue(notification));
    } else {
      yield put(ManualAction.manualsAction.deleteError(beforeId));
      const notification: MyNotification =
        { key: getKey(), variant: 'warning', message: 'マニュアルの削除に失敗しました' };
      yield put(notificationsAction.enqueue(notification));
    }
  }
}

function* handleManualCopy() {
  while (true) {
    const action = yield take(ManualAction.ACTIONS_MANUAL_COPY);
    const manual: Manual = action.payload;
    yield put(ManualAction.manualsAction.postForCopy(manual));
    const manualPostRes = yield call(API.manualPost, action.payload);
    if (manualPostRes.error === undefined) {
      yield put(ManualAction.manualsAction.postSuccess({ beforeId: manual.id, manual: manualPostRes }));
      
      if (manual.rootTree !== null) {
        const tree = TreeUtil._clearId(manual.rootTree);
        const params: TreePutRequest = {
          manualId: (manualPostRes as Manual).id,
          rootTree: tree
        }
        yield put(ManualAction.treeActions.putForCopy(params));
        const treePutRes = yield call(API.treePut, params);
        if (treePutRes.error === undefined) {
          yield put(ManualAction.treeActions.putSuccess(params.manualId));
          const notification: MyNotification =
            { key: getKey(), variant: 'success', message: 'マニュアルをコピーしました' };
          yield put(notificationsAction.enqueue(notification));
        } else {
          yield put(ManualAction.treeActions.putError(params.manualId));
          const notification: MyNotification =
            { key: getKey(), variant: 'warning', message: 'マニュアルのコピーに失敗しました' };
          yield put(notificationsAction.enqueue(notification));
        }
      }

    } else {
      yield put(ManualAction.manualsAction.postError(manual.id));
      const notification: MyNotification =
        { key: getKey(), variant: 'warning', message: 'マニュアルのコピーに失敗しました' };
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
      const notification: MyNotification =
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
      const notification: MyNotification =
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
      const notification: MyNotification =
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
      const notification: MyNotification =
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
      const notification: MyNotification =
        { key: getKey(), variant: 'success', message: 'マニュアルを保存しました' };
      yield put(notificationsAction.enqueue(notification));
    } else {
      yield put(ManualAction.treeActions.putError(beforeId));
      const notification: MyNotification =
        { key: getKey(), variant: 'warning', message: 'マニュアルの保存に失敗しました' };
      yield put(notificationsAction.enqueue(notification));
    }
  }
}


export function* rootSaga() {
  yield fork(handleRequestLogin);
  yield fork(handleRequestLogout);

  yield fork(handleRequestPutLoginUser);

  yield fork(handleRequestGetManual);
  yield fork(handleRequestPostManual);
  yield fork(handleRequestPutManual);
  yield fork(handleRequestDeleteManual);
  yield fork(handleManualCopy);

  yield fork(handleRequestPostFavorite);
  yield fork(handleRequestDeleteFavorite);
  
  yield fork(handleRequestPostLike);
  yield fork(handleRequestDeleteLike);

  yield fork(handleRequestPutTree);
}