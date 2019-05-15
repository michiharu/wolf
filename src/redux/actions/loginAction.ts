import actionCreatorFactory, { ActionCreator, Success, Failure } from 'typescript-fsa';
import User from '../../data-types/user';

const actionCreator = actionCreatorFactory();

export const loginActions = {
  login:  actionCreator<User>('ACTIONS_LOGIN'),
  logout: actionCreator<void>('ACTIONS_LOGOUT'),
};