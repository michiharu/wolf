import actionCreatorFactory from 'typescript-fsa';
import { Memo } from '../../../data-types/tree';

const actionCreator = actionCreatorFactory();
const ACTIONS_MEMOS_SET = 'ACTIONS_MEMOS_SET';
export const ACTIONS_MEMOS_CHANGE = 'ACTIONS_MEMOS_CHANGE';
const ACTIONS_MEMOS_CHANGE_SUCCESS = 'ACTIONS_MEMOS_CHANGE_SUCCESS';
const ACTIONS_MEMOS_CHANGE_ERROR = 'ACTIONS_MEMOS_CHANGE_ERROR';

export const memosActions = {
  set:           actionCreator<Memo[]>(ACTIONS_MEMOS_SET),
  change:        actionCreator<Memo[]>(ACTIONS_MEMOS_CHANGE),
  changeSuccess: actionCreator<Memo[]>(ACTIONS_MEMOS_CHANGE_SUCCESS),
  changeError:   actionCreator<void>(ACTIONS_MEMOS_CHANGE_ERROR),
};