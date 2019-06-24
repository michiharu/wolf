import { AppState } from "../store";

export const getTitleForCheck = (state: AppState) => state.titleCheck;
export const getKSize = (state: AppState) => state.ks.ks;
export const getLoginUser = (state: AppState) => state.loginUser.user;
export const getUsers = (state: AppState) => state.users.users;