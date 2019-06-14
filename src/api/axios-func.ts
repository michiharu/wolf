import {
  loginURL, LoginPostResponse,
  manualsURL, ManualPostRequest, FavoritePostRequestParams, favoriteURL, FavoriteDeleteRequestParams, likeURL, LikePostRequestParams, LikeDeleteRequestParams, TreePutRequest, ManualGetRequestParams, treeURL
} from "./definitions";

import axios from "./axios";
import { LoginInfo } from "../redux/actions/loginAction";

export const login = (loginInfo: LoginInfo) => axios
.post<LoginPostResponse>(loginURL, loginInfo)
.then(res => res.data)
.catch(error => ({ error }));

export const manualGet = (manual: ManualGetRequestParams) => axios
.get(`${manualsURL}/${manual.id}`)
.then(res => res.data)
.catch(error => ({ error }));

export const manualPost = (manual: ManualPostRequest) => axios
.post<ManualPostRequest>(manualsURL, manual)
.then(res => res.data)
.catch(error => ({ error }));

export const manualPut = (manual: ManualPostRequest) => axios
.put<ManualPostRequest>(`${manualsURL}/${manual.id}`, manual)
.then(res => res.data)
.catch(error => ({ error }));

export const manualDelete = (manual: ManualPostRequest) => axios
.delete(`${manualsURL}/${manual.id}`)
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

export const treePut = ({manualId, rootTree}: TreePutRequest) => axios
.put<ManualPostRequest>(`${treeURL}/${manualId}`, rootTree)
.then(res => res.data)
.catch(error => ({ error }));