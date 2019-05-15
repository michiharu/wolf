import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { loginActions } from '../actions/loginAction';
import User from '../../data-types/user';

export interface LoginState {
  user: User | null;
}

const initialState: LoginState = { user: null };

export const loginReducer = reducerWithInitialState(initialState)
.case(loginActions.login,  (state, user) => ({...state, user}))
.case(loginActions.logout, (state) => ({...state, user: null}))