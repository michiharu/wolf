import { RootState } from "../pages/state-manager";
import User from "../data-types/user";

/* Login */
export const loginURL = '/api/v1/login';
// POST
export interface LoginPostRequest {
  id: string;
  password: string;
}
export type LoginPostResponse = RootState;
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


