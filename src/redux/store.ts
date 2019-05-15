import { createStore, combineReducers } from 'redux';
import { LoginState,  loginReducer }    from './states/loginState'
import { ManualState, manualReducer }   from './states/manualState';

export type AppState = {
  login: LoginState,
  manuals: ManualState
};

const store = createStore(
  combineReducers<AppState>({
    login: loginReducer,
    manuals: manualReducer
  }),
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;