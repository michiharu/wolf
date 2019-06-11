import actionCreatorFactory from 'typescript-fsa';
import { Manual } from '../../../data-types/tree';

const actionCreator = actionCreatorFactory();
export const ACTIONS_MANUAL_SET    = 'ACTIONS_MANUAL_SET'; // ログイン後のマニュアルセット

export const ACTIONS_MANUAL_POST   = 'ACTIONS_MANUAL_POST';
export const ACTIONS_MANUAL_PUT    = 'ACTIONS_MANUAL_PUT';
export const ACTIONS_MANUAL_DELETE = 'ACTIONS_MANUAL_DELETE';

export const ACTIONS_MANUAL_POST_SUCCESS   = 'ACTIONS_MANUAL_POST_SUCCESS';
export const ACTIONS_MANUAL_PUT_SUCCESS    = 'ACTIONS_MANUAL_PUT_SUCCESS';
export const ACTIONS_MANUAL_DELETE_SUCCESS = 'ACTIONS_MANUAL_DELETE_SUCCESS';

export const ACTIONS_MANUAL_POST_ERROR   = 'ACTIONS_MANUAL_POST_ERROR';
export const ACTIONS_MANUAL_PUT_ERROR    = 'ACTIONS_MANUAL_PUT_ERROR';
export const ACTIONS_MANUAL_DELETE_ERROR = 'ACTIONS_MANUAL_DELETE_ERROR';

export const manualsAction = {
  set: actionCreator<Manual[]>(ACTIONS_MANUAL_SET),

  post: actionCreator<Manual>(ACTIONS_MANUAL_POST),
  postSuccess: actionCreator<{beforeId: string, manual: Manual}>(ACTIONS_MANUAL_POST_SUCCESS),
  postError: actionCreator<string>(ACTIONS_MANUAL_POST_ERROR),

  put: actionCreator<Manual>(ACTIONS_MANUAL_PUT),
  putSuccess: actionCreator<{beforeId: string, manual: Manual}>(ACTIONS_MANUAL_PUT_SUCCESS),
  putError: actionCreator<string>(ACTIONS_MANUAL_PUT_ERROR),

  delete: actionCreator<Manual>(ACTIONS_MANUAL_DELETE),
  deleteSuccess: actionCreator<string>(ACTIONS_MANUAL_DELETE_SUCCESS),
  deleteError: actionCreator<string>(ACTIONS_MANUAL_DELETE_ERROR),
};