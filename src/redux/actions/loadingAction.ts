import actionCreatorFactory from 'typescript-fsa';

export const actionCreator = actionCreatorFactory();

export const ACTIONS_LOADING_BEGIN_LOGIN = 'ACTIONS_LOADING_BEGIN_LOGIN';
export const ACTIONS_LOADING_END_LOGIN = 'ACTIONS_LOADING_END_LOGIN';

export const ACTIONS_LOADING_BEGIN_MANUAL_QUERY = 'ACTIONS_LOADING_BEGIN_MANUAL_QUERY';
export const ACTIONS_LOADING_END_MANUAL_QUERY = 'ACTIONS_LOADING_END_MANUAL_QUERY';

export const ACTIONS_LOADING_BEGIN_MANUAL = 'ACTIONS_LOADING_BEGIN_MANUAL';
export const ACTIONS_LOADING_END_MANUAL = 'ACTIONS_LOADING_END_MANUAL';

export const loadingActions = {
  beginLogin:  actionCreator<void>(ACTIONS_LOADING_BEGIN_LOGIN),
  endLogin: actionCreator<void>(ACTIONS_LOADING_END_LOGIN),
  beginManualQuery:  actionCreator<void>(ACTIONS_LOADING_BEGIN_MANUAL_QUERY),
  endManualQuery: actionCreator<void>(ACTIONS_LOADING_END_MANUAL_QUERY),
  beginManual:  actionCreator<void>(ACTIONS_LOADING_BEGIN_MANUAL),
  endManual: actionCreator<void>(ACTIONS_LOADING_END_MANUAL),
};