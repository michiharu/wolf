/**
 * POSTでのIdの扱いについて
 * POSTについてはサーバーサイドではIdの値を採番する。
 * そのためフロントからサーバーに送られるIDの値については無視すること。
 */
import User from "../data-types/user";
import { Tree, KTreeNode, Manual, PullRequest } from "../data-types/tree";
import Feed from "../data-types/feed";

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
  manuals: Manual[]; // owerなら片方向参照、collaboなら両方向参照
  assigns: Manual[]; // 両方向参照
  follows: Manual[]; // 両方向参照
  stars: Manual[];  // 片方向参照＋参照カウンター
  feeds: Feed[];
  commons: Tree[];
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

/* PullRequests */
export const pullRequestsURL = '/api/v1/pull-requests/';
// GET
// POST(/api/v1/pull-requests/)
export type PullRequestPostRequest = PullRequest;
export type PullRequestPostResponse = PullRequest;
// PUT(/api/v1/pull-requests/:id)
export type PullRequestPutRequest = PullRequest;
export type PullRequestPutResponse = PullRequest;
// DELETE

/* Assign */
export const assignURL = '/api/v1/assign/';
// POST(/api/v1/assign/:manualId/:userId)
export type AssignPostRequest = void;
export type AssignPostResponse = Manual;
// DELETE(/api/v1/assign/:manualId/:userId)

/* Follow */
export const followURL = '/api/v1/follow/';
// POST(/api/v1/follow/:manualId)
export type FollowPostRequest = void;
export type FollowPostResponse = Manual;
// DELETE(/api/v1/follow/:manualId)

/* Star */
export const starURL = '/api/v1/star/';
// POST(/api/v1/star/:manualId)
export type StarPostRequest = void;
export type StarPostResponse = Manual;
// DELETE(/api/v1/star/:manualId)