import { put, call, fork, take } from 'redux-saga/effects';
import * as API from '../api/axios-func';
import { ACTIONS_LOGIN } from './actions/login-data/loginAction';
import { loginUserAction } from './actions/login-data/loginUserAction';
import { LoginPostResponse } from '../api/definitions';
import { manualsAction, ACTIONS_MANUAL_POST, ACTIONS_MANUAL_PUT, ACTIONS_MANUAL_DELETE, } from './actions/login-data/manualsAction';
import { usersAction } from './actions/login-data/usersAction';
import { categoriesAction } from './actions/login-data/categoriesAction';

function* handleRequestLogin() {
  while (true) {
    const action = yield take(ACTIONS_LOGIN);
    const data = yield call(API.login, action.payload);
    if (data.error === undefined) {
      const { user, users, manuals, categories } = data as LoginPostResponse;
      yield put(loginUserAction.set(user));
      yield put(usersAction.change(users));
      yield put(manualsAction.set(manuals));
      yield put(categoriesAction.set(categories));
    }
  }
}

function* handleRequestPostManual() {
  while (true) {
    const action = yield take(ACTIONS_MANUAL_POST);
    const beforeId = action.payload.id;
    const data = yield call(API.manualPost, action.payload);
    if (data.error === undefined) {
      yield put(manualsAction.postSuccess({beforeId, manual: data}));
    } else {
      yield put(manualsAction.postError(beforeId));
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
    } else {
      yield put(manualsAction.putError(beforeId));
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

export function* rootSaga() {
  yield fork(handleRequestLogin);
  yield fork(handleRequestPostManual);
  yield fork(handleRequestPutManual);
  yield fork(handleRequestDeleteManual);
}