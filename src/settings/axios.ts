import axiosbase from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as env from './env.json';
import {
  loginURL, nodeURL
} from '../data-types/api';
import postLogin from '../mock-data/login/post';
import getNode from '../mock-data/node/get';

export const baseURL = 'http://localhost:51391';

const axios = env.useMock
  ? (() => {
    const mock = new MockAdapter(axiosbase, { delayResponse: 500 });
    mock.onPost(loginURL).reply(postLogin);
    mock.onGet (nodeURL) .reply(getNode);

    // mock.onGet   (url.organizations).reply(getOrganization);
    // mock.onPost  (url.organizations).reply(postOrganization);
    // const regexOrg = new RegExp(`${url.organizations}/*`);
    // mock.onPut   (regexOrg).reply(putOrganization);
    // mock.onDelete(regexOrg).reply(deleteOrganization);

    return axiosbase;
  })()
  : axiosbase.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

export default axios;