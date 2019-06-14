/**
 * POSTでのIdの扱いについて
 * POSTについてはサーバーサイドではIdの値を採番する。
 * そのためフロントからサーバーに送られるIDの値については無視すること。
 */
import User from "../data-types/user";
import { Manual, Tree, KTreeNode } from "../data-types/tree";
import Category from "../data-types/category";

/* Login */
export const loginURL = '/api/v1/login';
// POST
export interface LoginPostRequest {
  id: string;
  password: string;
}

export interface LoginPostResponse {
  user: User;
  users: User[];
  categories: Category[];
  manuals: Manual[];
  memos: KTreeNode[];
}
// DELETE -> ステータスコード200でログアウト

/* Users */
export const usersURL = '/api/v1/users';
// GET
// POST(/api/v1/users)
export type UserPostRequest = User;
export type UserPostResponse = User;
// PUT(/api/v1/users/:id)
export type UserPutRequest = User;
export type UserPutResponse = User;
// DELETE

/* Manuals */
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
export const manualsURL = '/api/v1/manuals';
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

/* Tree */
export const treeURL = '/api/v1/tree';
// PUT(/api/v1/tree/:manualId)
export type TreePutRequest = { manualId: string; rootTree: Tree; };
export type TreePutResponse = Tree;

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