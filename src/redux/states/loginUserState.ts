import { reducerWithInitialState } from 'typescript-fsa-reducers';
import User from '../../data-types/user';
import { loginUserActions } from '../actions/loginUserAction';

export interface LoginUserState {
  user: User | null;
}

const initialState: LoginUserState = { user: null };

export const loginUserReducer = reducerWithInitialState(initialState)
.case(loginUserActions.set,  (state, user) => ({...state, user}))
.case(loginUserActions.reset, (state) => ({...state, user: null}))