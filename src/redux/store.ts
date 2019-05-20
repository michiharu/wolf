import { createStore, combineReducers } from 'redux';
import { LoginState,  loginReducer }    from './states/loginState'
import { ManualState, manualReducer }   from './states/manualState';
import { MemoState, memoReducer } from './states/memoState';
import { SelectState, selectReducer } from './states/selectState';
import { KSState, ksReducer } from './states/ksState';
import { RSState, rsReducer } from './states/rsState';

export type AppState = {
  login: LoginState,
  manuals: ManualState,
  select: SelectState,
  memos: MemoState,
  ks: KSState,
  rs: RSState,
};

const store = createStore(
  combineReducers<AppState>({
    login: loginReducer,
    manuals: manualReducer,
    select: selectReducer,
    memos: memoReducer,
    ks: ksReducer,
    rs: rsReducer,
  }),
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;