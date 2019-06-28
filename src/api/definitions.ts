/**
 * POSTでのIdの扱いについて
 * POSTについてはサーバーサイドではIdの値を採番する。
 * そのためフロントからサーバーに送られるIDの値については無視すること。
 */
import User, { LoginUser } from "../data-types/user";
import { Manual, Tree, KTreeNode, Memo } from "../data-types/tree";
import Category from "../data-types/category";
import { Password } from "../data-types/password";
import UserGroup from "../data-types/user-group";
import { TitleCheckResult } from "../redux/actions/titileCheckAction";

/* Login */
export const loginURL = '/api/v1/login';
// POST
export interface LoginPostRequest {
  id: string;
  password: string;
}

export interface LoginPostResponse {
  user: LoginUser;
  users: User[];
  userGroups: UserGroup[];
  categories: Category[];
  manuals: Manual[];
  memos: KTreeNode[];
}
// DELETE -> ステータスコード200でログアウト

/* Users */
export const usersURL = '/api/v1/users';
// GET
// PUT(/api/v1/users/:id)
export type LoginUserPutRequest = LoginUser;
export type LoginUserPutResponse = LoginUser;
// DELETE

/* Users */
export const passwordURL = '/api/v1/password';
// GET
// PUT(/api/v1/password/:id) -> 成功の場合、ステータスコード200のみを返す
export type PasswordPutRequestParams = {
  user: LoginUser;
  password: Password;
}

/**
 * queryParamsは以下の通り
 * -filterList
 * -searchText
 * -sortColumn
 * -sortDirection
 * -page
 * -rowsPerPage
 * -count
 * 
 * 本来はGETメソッドでquery-stringsとしてパラメーターを渡したいが、
 * filterListのネストが深いのでPOSTを採用する
 **/
export const manualsURL = '/api/v1/manuals';

export interface ManualsQueryParams {
  filters: {
    favorite: Show;
    like: Show;
    categoryId: string | null;
  },
  searchText: string[];
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  page: number;
  rowsPerPage: number;
}

export enum Show { ALL, CHECK, UNCHECK }

export const baseManualQueryParams: ManualsQueryParams = {
  filters: {
    favorite: Show.ALL,
    like: Show.ALL,
    categoryId: null,
  },
  searchText: [],
  sortColumn: 'updateAt',
  sortDirection: 'desc',
  page: 0,
  rowsPerPage: 10
}

// レスポンスにQueryParamsを含めて返す
export interface ManualsQueryResponse {
  queryParams: ManualsQueryParams;
  manuals: Manual[];
  count: number;
}

/* Manual */
/**
 * PUTでのIdの扱いについて
 * マニュアルは編集終了ボタン押下時にサーバーへPUTされる。
 * childrenには編集されたTreeや新規作成されたTreeが存在するが
 * それぞれの状態に合わせた保存が必要となる。
 * 新しいTreeにはフロント側で"tmp:~"で始まるIdを降っているので、
 * それぞれのTreeのIdが"tmp:~"で始まっているかどうかでレコードのインサートなのかアップデートなのか
 * 判断できます。
 * 
 * ※GUIDは１６進数を表現するための文字列であるため、t, m, pといった文字は使用されません。
 * なので最初の一文字がtで始まるかどうかや、
 * GUIDとして適当な文字列かどうかをチェックするC#のメソッド（TryParse）で判定可能です。
 */
export const manualURL = '/api/v1/manual';
// GET(/api/v1/manuals/:id)
export type ManualGetRequestParams = Manual;
export type ManualGetResponse = Manual;
// POST(/api/v1/manuals)
export type ManualPostRequest = Manual;
export type ManualPostResponse = Manual;
// PUT(/api/v1/manuals/:id)
export type ManualPutRequest = Manual;
export type ManualPutResponse = Manual;
// DELETE
export type ManualDeleteResponse = {};

export const titleCheckURL = '/api/v1/manual-title-check';
export type TitleCheckPostRequest = { title: string; };
export type TitleCheckPostResponse = TitleCheckResult;

export const generateTitleURL = '/api/v1/manual-generate-title';
export type GenerateTitleRequest = { title: string; };
export type GenerateTitleResponse = TitleCheckResult;

/* Tree */
export const treeURL = '/api/v1/tree';
// PUT(/api/v1/tree/:manualId)
export type TreePutRequest = { manualId: string; rootTree: Tree; };
export type TreePutResponse = Tree;

/* Memo */
export const memosURL = '/api/v1/memos';
// PUT(/api/v1/memos)
export type MemosPutRequest = Memo[];
export type MemosPutResponse = Memo[];

/* Favorite */
export const favoriteURL = '/api/v1/favorites';
// POST(/api/v1/favorites/:manualId)
export type FavoritePostRequestParams = { manualId: string; userId: string; };
export type FavoritePostRequest = void;
export type FavoritePostResponse = {};
// DELETE(/api/v1/favorites/:manualId)
export type FavoriteDeleteRequestParams = { manualId: string; userId: string; };
export type FavoriteDeleteRequest = void;
export type FavoriteDeleteResponse = {};

/* Like */
export const likeURL = '/api/v1/likes';
// POST(/api/v1/likes/:manualId)
export type LikePostRequestParams = { manualId: string; userId: string; };
export type LikePostRequest = void;
export type LikePostResponse = {};
// DELETE(/api/v1/likes/:manualId)
export type LikeDeleteRequestParams = { manualId: string; userId: string; };
export type LikeDeleteRequest = void;
export type LikeDeleteResponse = {};