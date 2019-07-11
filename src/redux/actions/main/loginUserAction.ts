import actionCreatorFactory from 'typescript-fsa';
import { LoginUser } from '../../../data-types/user';

export const actionCreator = actionCreatorFactory();
export const ACTIONS_LOGINUSER_SET   = 'ACTIONS_LOGINUSER_SET';
export const ACTIONS_LOGINUSER_RESET = 'ACTIONS_LOGINUSER_RESET';

export const ACTIONS_LOGINUSER_START_SESSIONCHECK = 'ACTIONS_LOGINUSER_START_SESSIONCHECK';
export const ACTIONS_LOGINUSER_SESSIONCHECKED = 'ACTIONS_LOGINUSER_SESSIONCHECKED';

export const ACTIONS_LOGINUSER_PUT         = 'ACTIONS_LOGINUSER_PUT';
export const ACTIONS_LOGINUSER_PUT_SUCCESS = 'ACTIONS_LOGINUSER_PUT_SUCCESS';
export const ACTIONS_LOGINUSER_PUT_ERROR   = 'ACTIONS_LOGINUSER_PUT_ERROR';

export const loginUserAction = {
  set:   actionCreator<LoginUser>(ACTIONS_LOGINUSER_SET),
  reset: actionCreator<void>(ACTIONS_LOGINUSER_RESET),

  startSessionCheck: actionCreator<void>(ACTIONS_LOGINUSER_START_SESSIONCHECK),
  sessionChecked: actionCreator<void>(ACTIONS_LOGINUSER_SESSIONCHECKED),

  put:        actionCreator<LoginUser>(ACTIONS_LOGINUSER_PUT),
  putSuccess: actionCreator<void>(ACTIONS_LOGINUSER_PUT_SUCCESS),
  putError:   actionCreator<void>(ACTIONS_LOGINUSER_PUT_ERROR),
};