import { AxiosRequestConfig } from 'axios';
import {
  LikePostResponse
} from '../definitions';

export const postLike = (config: AxiosRequestConfig) => {
  const { method, url } = config;
  const data: LikePostResponse = {};

  console.log(method, url, data);
  return [200, data]
};

export const deleteLike = (config: AxiosRequestConfig) => {
  const { method, url } = config;
  const data: LikePostResponse = {};

  console.log(method, url, data);
  return [200, data]
};