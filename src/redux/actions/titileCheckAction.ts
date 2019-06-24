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
export const ACTIONS_TITLECHECK_GENERATE = 'ACTIONS_TITLECHECK_GENERATE';
export const ACTIONS_TITLECHECK_GENERATE_DONE = 'ACTIONS_TITLECHECK_GENERATE_DONE';

export const titleCheckAction = {
  set: actionCreator<{preTitle: string; willGenerate?: string}>(ACTIONS_TITLECHECK_SET_PRETITLE),
  enqueue: actionCreator<TitleSet>(ACTIONS_TITLECHECK_ENQUEUE),
  get: actionCreator<TitleCheckResult>(ACTIONS_TITLECHECK_RESULT_GET),
  generate: actionCreator<void>(ACTIONS_TITLECHECK_GENERATE),
  done: actionCreator<TitleCheckResult>(ACTIONS_TITLECHECK_GENERATE_DONE),
};