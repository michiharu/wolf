import { AxiosRequestConfig } from 'axios';
import {
  FavoritePostResponse,
  FavoriteDeleteResponse
} from '../definitions';

export const postFavorite = (config: AxiosRequestConfig) => {
  const { method, url } = config;
  const data: FavoritePostResponse = {};

  console.log(method, url, data);
  return [200, data]
};

export const deleteFavorite = (config: AxiosRequestConfig) => {
  const { method, url } = config;
  const data: FavoriteDeleteResponse = {};

  console.log(method, url, data);
  return [200, data]
};