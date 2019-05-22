import User from "../data-types/user";
import { Tree, KTreeNode, Manual } from "../data-types/tree";
import Feed from "../data-types/feed";

/* Login */
export const loginURL = '/api/v1/login';
// POST
export interface LoginPostRequest {
  id: string;
  password: string;
}

export interface LoginPostResponse {
  user: User | null;
  users: User[];
  owers: Manual[]; // 片方向参照
  collabos: Manual[]; // 両方向参照
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
// POST
export type UserPostRequest = User;
export type UserPostResponse = User;
// PUT
export type UserPutRequest = User;
export type UserPutResponse = User;
// DELETE


