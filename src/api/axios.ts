import axiosbase from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as env from '../settings/env.json';
import {loginURL, usersURL, manualsURL} from './definitions';
import postLogin from './mock-data/login/post';
import { postUser , putUser, deleteUser } from './mock-data/users';
import postManual from './mock-data/manual/post';
import putManual from './mock-data/manual/put';

export const baseURL = 'http://localhost:51391';

const mockAdapter = (() => {
  const mock = new MockAdapter(axiosbase, { delayResponse: 2000 });
  // login
  mock.onPost(loginURL).reply(postLogin);

  // manual
  mock.onPost(manualsURL).reply(postManual);
  const regexManualsURL = new RegExp(`${manualsURL}/*`);
  mock.onPut(regexManualsURL).reply(putManual);

  // Tree

  mock.onPost(usersURL).reply(postUser);
  const regexUsersURL = new RegExp(`${usersURL}/*`);
  mock.onPut(regexUsersURL).reply(putUser);
  mock.onDelete(regexUsersURL).reply(deleteUser);

  // URLに正規表現も使える↓↓
  // const regexOrg = new RegExp(`${url.organizations}/*`);
  // mock.onPut   (regexOrg).reply(putOrganization);
  // mock.onDelete(regexOrg).reply(deleteOrganization);

  return axiosbase;
})();

const axios = env.useMock ? mockAdapter : axiosbase.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

export default axios;