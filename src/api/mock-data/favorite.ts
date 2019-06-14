import { AxiosRequestConfig } from 'axios';
import {
  FavoritePostResponse,
  FavoriteDeleteResponse
} from '../definitions';

export const post = (config: AxiosRequestConfig) => {
  const { method, url } = config;
  const data: FavoritePostResponse = {};

  console.log(method, url, data);
  return [200, data]
};

export const _delete = (config: AxiosRequestConfig) => {
  const { method, url } = config;
  const data: FavoriteDeleteResponse = {};

  console.log(method, url, data);
  return [200, data]
};