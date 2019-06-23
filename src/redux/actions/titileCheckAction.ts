import actionCreatorFactory from 'typescript-fsa';

export interface TitleSet {
  preTitle: string;
  title: string;
}

export interface TitleCheckResult {
  title: string;
  valid: boolean;
}

const actionCreator = actionCreatorFactory();

export const ACTIONS_TITLECHECK_SET_PRETITLE = 'ACTIONS_TITLECHECK_SET_PRETITLE';
export const ACTIONS_TITLECHECK_ENQUEUE = 'ACTIONS_TITLECHECK_ENQUEUE';
export const ACTIONS_TITLECHECK_RESULT_GET = 'ACTIONS_TITLECHECK_RESULT_GET';
export const ACTIONS_TITLECHECK_WILL_GENERATE = 'ACTIONS_TITLECHECK_WILL_GENERATE';
export const ACTIONS_TITLECHECK_RESET = 'ACTIONS_TITLECHECK_RESET';

export const titleCheckAction = {
  set: actionCreator<string>(ACTIONS_TITLECHECK_SET_PRETITLE),
  enqueue: actionCreator<TitleSet>(ACTIONS_TITLECHECK_ENQUEUE),
  get: actionCreator<TitleCheckResult>(ACTIONS_TITLECHECK_RESULT_GET),
  willGenerate: actionCreator<void>(ACTIONS_TITLECHECK_WILL_GENERATE),
  reset: actionCreator<void>(ACTIONS_TITLECHECK_RESET),
};