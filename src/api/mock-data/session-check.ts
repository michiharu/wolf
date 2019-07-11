import { AxiosRequestConfig } from 'axios';
import { LoginPostResponse } from '../definitions';
import { user1, user2, user3, user4 } from './common-data/users';
import { manual1, manual2, manual3, manual4 } from './common-data/manuals';
import { category1, category2, category3 } from './common-data/categories';
import { userGroup1, userGroup2 } from './common-data/userGroups';
import Category from '../../data-types/category';

export const postSessionCheck = (config: AxiosRequestConfig) => {
  const { method, url } = config;

  const users = [user1, user2, user3, user4];
  const userGroups = [userGroup1, userGroup2];
  const manuals = [manual1, manual2, manual3, manual4];
  const categories: Category[] = [...Array(300)]
  .map(_ =>  [category1, category2, category3])
  .reduce((a, b) => a.concat(b))
  .map((c, i) => ({id: String(i), name: `${c.name} (${i})`}));

  const data1: LoginPostResponse = {
    user: user1,
    users, userGroups, manuals, categories,
  };

  const data2: LoginPostResponse = {
    user: user2,
    users, userGroups, manuals, categories,
  };

  const data3: LoginPostResponse = {
    user: user3,
    users, userGroups, manuals, categories,
  };

  const data4: LoginPostResponse = {
    user: user4,
    users, userGroups, manuals, categories,
  };

  const rand = Math.floor(Math.random() * 8);
  const data = rand < 4
    ? [data1, data2, data3, data4].find((d, i) => i === rand)
    : { error: {} };
  console.log(method, url, data);
  return [200, data]
};