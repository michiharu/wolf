import { loginURL, LoginPostResponse } from "../definitions";
import axios from "../axios";
import { LoginInfo } from "../../redux/actions/loginAction";

export const login = (loginInfo: LoginInfo) => axios
.post<LoginPostResponse>(loginURL, loginInfo)
.then(res => res.data)
.catch(error => ({ error }));
