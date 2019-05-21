import { AxiosRequestConfig } from 'axios';
import { LoginPostResponse } from '../../definitions';
import { user1, user2, user3, user4 } from '../common-data/users';
import { manual1, manual2 } from '../common-data/manuals';

const postLogin = (config: AxiosRequestConfig) => {
  const { method, url, data: requestJson } = config;
  const req = JSON.parse(requestJson);

  const data1: LoginPostResponse = {
    user: user1,
    users: [user1, user2, user3, user4],
    manuals: [manual1, manual2],
    commons: [],
    memos: [],
  };

  const data2: LoginPostResponse = {
    user: user2,
    users: [user1, user2, user3, user4],
    manuals: [manual1],
    commons: [],
    memos: [],
  };

  const data3: LoginPostResponse = {
    user: user3,
    users: [user1, user2, user3, user4],
    manuals: [manual1],
    commons: [],
    memos: [],
  };

  const data4: LoginPostResponse = {
    user: user4,
    users: [user1, user2, user3, user4],
    manuals: [manual2],
    commons: [],
    memos: [],
  };

  const data = req.id === '1' ? data1 : req.id === '2' ? data2 : req.id === '3' ? data3 : data4;
  console.log(method, url, req, data);
  return [200, data]
};

export default postLogin;