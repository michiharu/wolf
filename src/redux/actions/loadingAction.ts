import actionCreatorFactory from 'typescript-fsa';

export const actionCreator = actionCreatorFactory();
export const ACTIONS_LOADING_BEGIN_LOGIN = 'ACTIONS_LOADING_BEGIN_LOGIN';
export const ACTIONS_LOADING_END_LOGIN = 'ACTIONS_LOADING_END_LOGIN';

export const loadingActions = {
  beginLogin:  actionCreator<void>(ACTIONS_LOADING_BEGIN_LOGIN),
  endLogin: actionCreator<void>(ACTIONS_LOADING_END_LOGIN),
};