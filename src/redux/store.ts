import { createStore, combineReducers } from 'redux';
import { LoginState,  loginReducer }    from './states/loginState'
import { ManualState, manualReducer }   from './states/manualState';
import { MemoState, memoReducer } from './states/memoState';

export type AppState = {
  login: LoginState,
  manuals: ManualState,
  memos: MemoState,
};

const store = createStore(
  combineReducers<AppState>({
    login: loginReducer,
    manuals: manualReducer,
    memos: memoReducer,
  }),
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;