import { createStore, combineReducers } from 'redux';
import { LoginState,  loginReducer }    from './states/loginState'
import { ManualState, manualReducer }   from './states/manualState';
import { MemoState, memoReducer } from './states/memoState';
import { SelectState, selectReducer } from './states/selectState';

export type AppState = {
  login: LoginState,
  manuals: ManualState,
  select: SelectState,
  memos: MemoState,
};

const store = createStore(
  combineReducers<AppState>({
    login: loginReducer,
    manuals: manualReducer,
    select: selectReducer,
    memos: memoReducer,
  }),
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;