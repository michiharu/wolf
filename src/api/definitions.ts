/**
 * POSTでのIdの扱いについて
 * POSTについてはサーバーサイドではIdの値を採番する。
 * そのためフロントからサーバーに送られるIDの値については無視すること。
 */
import User from "../data-types/user";
import { KTreeNode, Manual } from "../data-types/tree";
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
  favorites: string[];
  likes: string[];
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
// GET
// POST(/api/v1/manuals)
export type ManualPostRequest = Manual;
export type ManualPostResponse = Manual;
// PUT(/api/v1/manuals/:id)
export type ManualPutRequest = Manual;
export type ManualPutResponse = Manual;
// DELETE

/* Favorite */
export const favoriteURL = '/api/v1/favorites/';
// POST(/api/v1/favorites/:manualId)
export type FollowPostRequest = { follow: boolean };
export type FollowPostResponse = void;
// DELETE(/api/v1/favorites/:manualId)

/* Like */
export const likeURL = '/api/v1/likes/';
// POST(/api/v1/likes/:manualId)
export type StarPostRequest = void;
export type StarPostResponse = void;
// DELETE(/api/v1/likes/:manualId)