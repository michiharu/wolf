import axiosbase from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { loginURL, manualURL, favoriteURL, likeURL, treeURL, usersURL, passwordURL, titleCheckURL, generateTitleURL, manualsURL, sessionCheckURL } from './definitions';
import { postLogin, deleteLogin } from './mock-data/login';
import * as Manual from './mock-data/manual';
import * as Favorite from './mock-data/favorite';
import * as Like from './mock-data/like';
import { putTree } from './mock-data/tree';
import { putLoginUser } from './mock-data/login-user';
import { putPassword } from './mock-data/password';
import { postTitleCheck } from './mock-data/title-checker';
import { postGenerateTitle } from './mock-data/generate-title';
import { postManualsQuery } from './mock-data/manuals';
import { postSessionCheck } from './mock-data/session-check';

export const baseURL = 'http://localhost:55616';

const mockAdapter = () => {
  const mock = new MockAdapter(axiosbase, { delayResponse: 500 });
  // login
  mock.onPost(loginURL).reply(postLogin);
  mock.onDelete(loginURL).reply(deleteLogin);

  // session check
  mock.onPost(sessionCheckURL).reply(postSessionCheck);

  // LoginUser
  const regexUsersURL = new RegExp(`${usersURL}/*`);
  mock.onPut(regexUsersURL).reply(putLoginUser);

  // Password
  const regexPasswordURL = new RegExp(`${passwordURL}/*`);
  mock.onPut(regexPasswordURL).reply(putPassword);

  // manuals query
  mock.onPost(manualsURL).reply(postManualsQuery);

  // manual
  const regexManualsURL = new RegExp(`${manualURL}/*`);
  mock.onGet(regexManualsURL).reply(Manual.get);
  mock.onPost(manualURL).reply(Manual.post);
  mock.onPut(regexManualsURL).reply(Manual.put);
  mock.onDelete(regexManualsURL).reply(Manual._delete);

  
  mock.onPost(titleCheckURL).reply(postTitleCheck);
  mock.onPost(generateTitleURL).reply(postGenerateTitle);


  // favorite
  const regexFavoriteURL= new RegExp(`${favoriteURL}/*`);
  mock.onPost(regexFavoriteURL).reply(Favorite.post);
  mock.onDelete(regexFavoriteURL).reply(Favorite._delete);

  // like
  const regexLikeURL= new RegExp(`${likeURL}/*`);
  mock.onPost(regexLikeURL).reply(Like.post);
  mock.onDelete(regexLikeURL).reply(Like._delete);

  // tree
  const regexTreeURL = new RegExp(`${treeURL}/*`);
  mock.onPut(regexTreeURL).reply(putTree);

  return axiosbase;
};

const axios = true ? mockAdapter() : axiosbase.create({
    baseURL,
    headers: {'Content-Type': 'application/json'},
  });

export default axios;