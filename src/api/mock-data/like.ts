import { AxiosRequestConfig } from 'axios';
import {
  LikePostResponse
} from '../definitions';

export const post = (config: AxiosRequestConfig) => {
  const { method, url } = config;
  const data: LikePostResponse = {};

  console.log(method, url, data);
  return [200, data]
};

export const _delete = (config: AxiosRequestConfig) => {
  const { method, url } = config;
  const data: LikePostResponse = {};

  console.log(method, url, data);
  return [200, data]
};