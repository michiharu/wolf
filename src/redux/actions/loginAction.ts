import actionCreatorFactory from 'typescript-fsa';

export interface LoginInfo {
  id: string;
  password: string;
}
export const actionCreator = actionCreatorFactory();
export const ACTIONS_LOGIN = 'ACTIONS_LOGIN';
export const ACTIONS_LOGOUT = 'ACTIONS_LOGOUT';

export const loginActions = {
  login:  actionCreator<LoginInfo>(ACTIONS_LOGIN),
  logout: actionCreator<void>(ACTIONS_LOGOUT),
};