import { put, call, fork, take } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import * as API from '../api/axios-func/axios';
import { ACTIONS_LOGIN, LoginInfo } from './actions/loginAction';
import { loginUserActions } from './actions/loginUserAction';

function* handleRequestLogin() {
  while (true) {
    console.log('This is handleRequestLogin().')
    const action = yield take(ACTIONS_LOGIN);
    const { user } = yield call(API.login, action.payload);
    console.log('This is payload after call.')
    console.log(user)
    if (user) {
      yield put(loginUserActions.set(user));
    }
  }
}

export function* rootSaga() {
  console.log('This is rootSaga().')
  yield fork(handleRequestLogin);
}