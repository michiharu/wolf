import actionCreatorFactory from 'typescript-fsa';
import { Manual, TreeNode } from '../../../data-types/tree';

const actionCreator = actionCreatorFactory();
export const ACTIONS_MANUAL_SET    = 'ACTIONS_MANUAL_SET'; // ログイン後のマニュアルセット

export const ACTIONS_MANUAL_POST         = 'ACTIONS_MANUAL_POST';
export const ACTIONS_MANUAL_POST_SUCCESS = 'ACTIONS_MANUAL_POST_SUCCESS';
export const ACTIONS_MANUAL_POST_ERROR   = 'ACTIONS_MANUAL_POST_ERROR';

export const ACTIONS_MANUAL_PUT          = 'ACTIONS_MANUAL_PUT';
export const ACTIONS_MANUAL_PUT_SUCCESS  = 'ACTIONS_MANUAL_PUT_SUCCESS';
export const ACTIONS_MANUAL_PUT_ERROR    = 'ACTIONS_MANUAL_PUT_ERROR';

export const ACTIONS_MANUAL_DELETE         = 'ACTIONS_MANUAL_DELETE';
export const ACTIONS_MANUAL_DELETE_SUCCESS = 'ACTIONS_MANUAL_DELETE_SUCCESS';
export const ACTIONS_MANUAL_DELETE_ERROR   = 'ACTIONS_MANUAL_DELETE_ERROR';

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

export const ACTIONS_SELECT_SELECT = 'ACTIONS_SELECT_SELECT';
export const ACTIONS_SELECT_UPDATE = 'ACTIONS_SELECT_UPDATE';
export const ACTIONS_SELECT_CLEAR  = 'ACTIONS_SELECT_CLEAR';

export const selectActions = {
  select: actionCreator<Manual>(ACTIONS_SELECT_SELECT),
  update: actionCreator<TreeNode>(ACTIONS_SELECT_UPDATE),
  clear:  actionCreator<void>(ACTIONS_SELECT_CLEAR),
};

export const ACTIONS_FAVORITE_POST         = 'ACTIONS_FAVORITE_POST';
export const ACTIONS_FAVORITE_POST_SUCCESS = 'ACTIONS_FAVORITE_POST_SUCCESS';
export const ACTIONS_FAVORITE_POST_ERROR   = 'ACTIONS_FAVORITE_POST_ERROR';

export const ACTIONS_FAVORITE_DELETE         = 'ACTIONS_FAVORITE_DELETE';
export const ACTIONS_FAVORITE_DELETE_SUCCESS = 'ACTIONS_FAVORITE_DELETE_SUCCESS';
export const ACTIONS_FAVORITE_DELETE_ERROR   = 'ACTIONS_FAVORITE_DELETE_ERROR';

export const favoriteActions = {
  post: actionCreator<string>(ACTIONS_FAVORITE_POST),
  postSuccess: actionCreator<void>(ACTIONS_FAVORITE_POST_SUCCESS),
  postError: actionCreator<void>(ACTIONS_FAVORITE_POST_ERROR),

  delete: actionCreator<string>(ACTIONS_FAVORITE_DELETE),
  deleteSuccess: actionCreator<void>(ACTIONS_FAVORITE_DELETE_SUCCESS),
  deleteError: actionCreator<void>(ACTIONS_FAVORITE_DELETE_ERROR),
}