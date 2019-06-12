import { reducerWithInitialState } from 'typescript-fsa-reducers';
import User from '../../../data-types/user';
import { loginUserAction } from '../../actions/main/loginUserAction';

export interface LoginUserState {
  user: User | null;
}

const initialState: LoginUserState = { user: null };

export const loginUserReducer = reducerWithInitialState(initialState)
.case(loginUserAction.set,  (state, user) => ({...state, user}))
.case(loginUserAction.reset, (state) => ({...state, user: null}))