import axiosbase from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as env from '../settings/env.json';
import { loginURL, manualsURL, favoriteURL, likeURL } from './definitions';
import { postLogin } from './mock-data/login';
import { postManual, putManual, deleteManual, getManual } from './mock-data/manual';
import { postFavorite, deleteFavorite } from './mock-data/favorite';
import { postLike, deleteLike } from './mock-data/like';

export const baseURL = 'http://localhost:51391';

const mockAdapter = (() => {
  const mock = new MockAdapter(axiosbase, { delayResponse: 1000 });
  // login
  mock.onPost(loginURL).reply(postLogin);

  // manual
  const regexManualsURL = new RegExp(`${manualsURL}/*`);
  mock.onGet(regexManualsURL).reply(getManual);
  mock.onPost(manualsURL).reply(postManual);
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
  

  return axiosbase;
})();

const axios = env.useMock ? mockAdapter : axiosbase.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

export default axios;