import actionCreatorFactory from 'typescript-fsa';
import { Manual, TreeNode, Tree } from '../../../data-types/tree';
import { TreePutRequest, FavoritePostRequestParams, FavoriteDeleteRequestParams, LikePostRequestParams, LikeDeleteRequestParams } from '../../../api/definitions';

const actionCreator = actionCreatorFactory();

export const ACTIONS_MANUAL_GET          = 'ACTIONS_MANUAL_GET';
export const ACTIONS_MANUAL_GET_SUCCESS  = 'ACTIONS_MANUAL_GET_SUCCESS';
export const ACTIONS_MANUAL_GET_ERROR    = 'ACTIONS_MANUAL_GET_ERROR';

export const ACTIONS_SELECT_UPDATE = 'ACTIONS_SELECT_UPDATE';
export const ACTIONS_SELECT_CLEAR = 'ACTIONS_SELECT_CLEAR';

export const ACTIONS_MANUAL_POST         = 'ACTIONS_MANUAL_POST';

export const ACTIONS_MANUAL_PUT          = 'ACTIONS_MANUAL_PUT';
export const ACTIONS_MANUAL_PUT_SUCCESS  = 'ACTIONS_MANUAL_PUT_SUCCESS';
export const ACTIONS_MANUAL_PUT_ERROR    = 'ACTIONS_MANUAL_PUT_ERROR';

export const ACTIONS_MANUAL_DELETE         = 'ACTIONS_MANUAL_DELETE';

export const ACTIONS_FAVORITE_POST = 'ACTIONS_FAVORITE_POST';
export const ACTIONS_FAVORITE_DELETE = 'ACTIONS_FAVORITE_DELETE';
export const ACTIONS_LIKE_POST = 'ACTIONS_LIKE_POST';
export const ACTIONS_LIKE_DELETE = 'ACTIONS_LIKE_DELETE';

export const ACTIONS_MANUAL_COPY   = 'ACTIONS_MANUAL_COPY';
export const ACTIONS_MANUAL_POST_FOR_COPY   = 'ACTIONS_MANUAL_POST_FOR_COPY';

export const manualAction = {
  get:        actionCreator<string>(ACTIONS_MANUAL_GET),
  getSuccess: actionCreator<Manual>  (ACTIONS_MANUAL_GET_SUCCESS),

  update: actionCreator<TreeNode>(ACTIONS_SELECT_UPDATE),
  clear: actionCreator<void>(ACTIONS_SELECT_CLEAR),

  post: actionCreator<Manual>(ACTIONS_MANUAL_POST),

  put: actionCreator<Manual>(ACTIONS_MANUAL_PUT),
  putSuccess: actionCreator<Manual>(ACTIONS_MANUAL_PUT_SUCCESS),

  delete: actionCreator<Manual>(ACTIONS_MANUAL_DELETE),

  checkFavorite: actionCreator<FavoritePostRequestParams>(ACTIONS_FAVORITE_POST),
  uncheckFavorite: actionCreator<FavoriteDeleteRequestParams>(ACTIONS_FAVORITE_DELETE),

  checkLike: actionCreator<LikePostRequestParams>(ACTIONS_LIKE_POST),
  uncheckLike: actionCreator<LikeDeleteRequestParams>(ACTIONS_LIKE_DELETE),

  copy: actionCreator<Manual>(ACTIONS_MANUAL_COPY),
  postForCopy: actionCreator<Manual>(ACTIONS_MANUAL_POST_FOR_COPY),
};

export const ACTIONS_TREE_PUT         = 'ACTIONS_TREE_PUT';
export const ACTIONS_TREE_PUT_SUCCESS = 'ACTIONS_TREE_PUT_SUCCESS';
export const ACTIONS_TREE_PUT_ERROR   = 'ACTIONS_TREE_PUT_ERROR';

export const ACTIONS_TREE_PUT_FOR_COPY = 'ACTIONS_TREE_PUT_FOR_COPY';

export const treeActions = {
  put: actionCreator<TreePutRequest>(ACTIONS_TREE_PUT),
  putSuccess: actionCreator<Tree>(ACTIONS_TREE_PUT_SUCCESS),
  putError: actionCreator<string>(ACTIONS_TREE_PUT_ERROR),
}