import actionCreatorFactory from 'typescript-fsa';
import User from '../../../data-types/user';

export const actionCreator = actionCreatorFactory();
export const ACTIONS_USER_SET = 'ACTIONS_USER_SET';
export const ACTIONS_USER_RESET = 'ACTIONS_USER_RESET';

export const loginUserAction = {
  set:  actionCreator<User>(ACTIONS_USER_SET),
  reset: actionCreator<void>(ACTIONS_USER_RESET),
};