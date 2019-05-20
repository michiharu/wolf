import User from "../data-types/user";
import { Tree, KTreeNode, Manual } from "../data-types/tree";

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
  manuals: Manual[];
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


