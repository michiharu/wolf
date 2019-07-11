import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { LoginUser } from '../../../data-types/user';
import { loginUserAction } from '../../actions/main/loginUserAction';

export interface LoginUserState {
  user: LoginUser | null;
  userBeforeSaving: LoginUser | null;
  sessionChecked: boolean;
}

const initialState: LoginUserState = { user: null, userBeforeSaving: null, sessionChecked: false };

export const loginUserReducer = reducerWithInitialState(initialState)
.case(loginUserAction.set, (state, user) => ({...state, user}))

.case(loginUserAction.sessionChecked, (state) => ({...state, sessionChecked: true}))

.case(
  loginUserAction.put,
  (state, user) => ({...state, user, userBeforeSaving: state.user})
)
.case(
  loginUserAction.putSuccess,
  (state) => ({...state, userBeforeSaving: null})
)
.case(
  loginUserAction.putError,
  (state) => ({...state, user: state.userBeforeSaving, userBeforeSaving: null})
)
.case(loginUserAction.reset,  (state) => ({...state, user: null}))