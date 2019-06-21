import { AxiosRequestConfig } from 'axios';
import { LoginUserPutRequest, LoginUserPutResponse } from '../definitions';

export const putLoginUser = (config: AxiosRequestConfig) => {
  const { method, url, data: requestJson } = config;
  const req = JSON.parse(requestJson) as LoginUserPutRequest;

  const data: LoginUserPutResponse = {...req};

  console.log(method, url, req, data);
  return [200, data]
};