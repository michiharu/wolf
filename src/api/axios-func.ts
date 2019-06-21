import {
  loginURL, LoginPostResponse,
  usersURL, LoginUserPutRequest, LoginUserPutResponse, 
  manualURL, ManualPostRequest, ManualGetRequestParams,
  treeURL, TreePutRequest,
  favoriteURL, FavoritePostRequestParams, FavoriteDeleteRequestParams,
  likeURL, LikePostRequestParams, LikeDeleteRequestParams,
} from "./definitions";

import axios from "./axios";
import { LoginInfo } from "../redux/actions/loginAction";

export const login = (loginInfo: LoginInfo) => axios
  .post<LoginPostResponse>(loginURL, loginInfo)
  .then(res => res.data)
  .catch(error => ({ error }));

export const logout = () => axios
  .delete(loginURL)
  .then(res => res.data)
  .catch(error => ({ error }));

export const loginUserPut = (user: LoginUserPutRequest) => axios
  .put<LoginUserPutResponse>(`${usersURL}/${user.id}`, user)
  .then(res => res.data)
  .catch(error => ({ error }));

  // export const passwordPut = (params: PasswordPutRequestParams) => axios
  // .put<Password>(`${passwordURL}/${params.user.id}`, params.password)
  // .then(res => res.data)
  // .catch(error => ({ error }));

export const manualGet = (manual: ManualGetRequestParams) => axios
  .get(`${manualURL}/${manual.id}`)
  .then(res => res.data)
  .catch(error => ({ error }));

export const manualPost = (manual: ManualPostRequest) => axios
  .post<ManualPostRequest>(manualURL, manual)
  .then(res => res.data)
  .catch(error => ({ error }));

export const manualPut = (manual: ManualPostRequest) => axios
  .put<ManualPostRequest>(`${manualURL}/${manual.id}`, manual)
  .then(res => res.data)
  .catch(error => ({ error }));

export const manualDelete = (manual: ManualPostRequest) => axios
  .delete(`${manualURL}/${manual.id}`)
  .then(res => res.data)
  .catch(error => ({ error }));

export const favoritePost = (params: FavoritePostRequestParams) => axios
  .post<void>(`${favoriteURL}/${params.manualId}`)
  .then(res => res.data)
  .catch(error => ({ error }));

export const favoriteDelete = (params: FavoriteDeleteRequestParams) => axios
  .delete(`${favoriteURL}/${params.manualId}`)
  .then(res => res.data)
  .catch(error => ({ error }));

export const likePost = (params: LikePostRequestParams) => axios
  .post<void>(`${likeURL}/${params.manualId}`)
  .then(res => res.data)
  .catch(error => ({ error }));

export const likeDelete = (params: LikeDeleteRequestParams) => axios
  .delete(`${likeURL}/${params.manualId}`)
  .then(res => res.data)
  .catch(error => ({ error }));

export const treePut = ({ manualId, rootTree }: TreePutRequest) => axios
  .put<TreePutRequest>(`${treeURL}/${manualId}`, rootTree)
  .then(res => res.data)
  .catch(error => ({ error }));