import { put, call, fork, take } from 'redux-saga/effects';
import * as API from '../api/axios-func/login';
import { ACTIONS_LOGIN } from './actions/loginAction';
import { loginUserAction } from './actions/loginUserAction';
import { LoginPostResponse } from '../api/definitions';
import { manualsAction } from './actions/manualsAction';
import { usersAction } from './actions/usersAction';
import { categoriesAction } from './actions/categoriesAction';

function* handleRequestLogin() {
  while (true) {
    const action = yield take(ACTIONS_LOGIN);
    const data = yield call(API.login, action.payload);
    if (data.error === undefined) {
      const { user, users, manuals, categories } = data as LoginPostResponse;
      yield put(loginUserAction.set(user));
      yield put(usersAction.change(users));
      yield put(manualsAction.change(manuals));
      yield put(categoriesAction.set(categories));
    }
  }
}

export function* rootSaga() {
  yield fork(handleRequestLogin);
}