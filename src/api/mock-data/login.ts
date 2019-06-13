import { AxiosRequestConfig } from 'axios';
import { LoginPostResponse } from '../definitions';
import { user1, user2, user3, user4 } from './common-data/users';
import { manual1, manual2, manual3, manual11 } from './common-data/manuals';
import { category1, category2, category3 } from './common-data/categories';

export const postLogin = (config: AxiosRequestConfig) => {
  const { method, url, data: requestJson } = config;
  const req = JSON.parse(requestJson);

  const users = [user1, user2, user3, user4];
  const manuals = [manual1, manual11, manual2, manual3];
  const categories = [category1, category2, category3];

  const data1: LoginPostResponse = {
    user: user1,
    users, manuals, categories,
    memos: [],
  };

  const data2: LoginPostResponse = {
    user: user2,
    users, manuals, categories,
    memos: [],
  };

  const data3: LoginPostResponse = {
    user: user3,
    users, manuals, categories,
    memos: [],
  };

  const data4: LoginPostResponse = {
    user: user4,
    users, manuals, categories,
    memos: [],
  };

  const data = req.id === '1' ? data1 : req.id === '2' ? data2 : req.id === '3' ? data3 : data4;
  console.log(method, url, req, data);
  return [200, data]
};