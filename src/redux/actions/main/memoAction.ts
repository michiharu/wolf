import actionCreatorFactory from 'typescript-fsa';
import { Memo } from '../../../data-types/tree';

const actionCreator = actionCreatorFactory();
export const ACTIONS_MEMOS_CHANGE = 'ACTIONS_MEMOS_CHANGE';
const ACTIONS_MEMOS_CHANGE_SUCCESS = 'ACTIONS_MEMOS_CHANGE_SUCCESS';
const ACTIONS_MEMOS_CHANGE_ERROR = 'ACTIONS_MEMOS_CHANGE_ERROR';

export const memosActions = {
  change:        actionCreator<Memo[]>(ACTIONS_MEMOS_CHANGE),
  changeSuccess: actionCreator<Memo[]>(ACTIONS_MEMOS_CHANGE_SUCCESS),
  changeError:   actionCreator<void>(ACTIONS_MEMOS_CHANGE_ERROR),
};