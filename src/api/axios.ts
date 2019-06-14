import axiosbase from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as env from '../settings/env.json';
import { loginURL, manualURL, favoriteURL, likeURL, treeURL } from './definitions';
import { postLogin } from './mock-data/login';
import { postManual, putManual, deleteManual, getManual } from './mock-data/manual';
import { postFavorite, deleteFavorite } from './mock-data/favorite';
import { postLike, deleteLike } from './mock-data/like';
import { putTree } from './mock-data/tree';

export const baseURL = 'http://localhost:51391';

const mockAdapter = () => {
  const mock = new MockAdapter(axiosbase, { delayResponse: 1000 });
  // login
  mock.onPost(loginURL).reply(postLogin);

  // manual
  const regexManualsURL = new RegExp(`${manualURL}/*`);
  mock.onGet(regexManualsURL).reply(getManual);
  mock.onPost(manualURL).reply(postManual);
  mock.onPut(regexManualsURL).reply(putManual);
  mock.onDelete(regexManualsURL).reply(deleteManual);

  // favorite
  const regexFavoriteURL= new RegExp(`${favoriteURL}/*`);
  mock.onPost(regexFavoriteURL).reply(postFavorite);
  mock.onDelete(regexFavoriteURL).reply(deleteFavorite);

  // like
  const regexLikeURL= new RegExp(`${likeURL}/*`);
  mock.onPost(regexLikeURL).reply(postLike);
  mock.onDelete(regexLikeURL).reply(deleteLike);

  // tree
  const regexTreeURL = new RegExp(`${treeURL}/*`);
  mock.onPut(regexTreeURL).reply(putTree);

  return axiosbase;
};

const axios = env.useMock ? mockAdapter() : axiosbase.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

export default axios;