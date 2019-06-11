import { reducerWithInitialState } from 'typescript-fsa-reducers';
import User from '../../../data-types/user';
import { usersAction } from '../../actions/login-data/usersAction';

export interface UsersState {
  users: User[];
}

const initialState: UsersState = {
  users: []
};

export const usersReducer = reducerWithInitialState(initialState)
.case(usersAction.change, (state, users) => ({...state, users}))