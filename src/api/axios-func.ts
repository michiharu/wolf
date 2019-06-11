import {
  loginURL, LoginPostResponse,
  manualsURL, ManualPostRequest
} from "./definitions";

import axios from "./axios";
import { LoginInfo } from "../redux/actions/login-data/loginAction";

export const login = (loginInfo: LoginInfo) => axios
.post<LoginPostResponse>(loginURL, loginInfo)
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