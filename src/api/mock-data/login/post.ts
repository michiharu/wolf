import { AxiosRequestConfig } from 'axios';
import { LoginPostResponse } from '../../definitions';
import { user1, user2, user3, user4 } from '../common-data/users';
import { manual1 } from '../common-data/manuals';

const postLogin = (config: AxiosRequestConfig) => {
  const { method, url, data: requestJson } = config;
  const req = JSON.parse(requestJson);

  const data: LoginPostResponse = {
    user: req.id === '1' ? user1 : req.id === '2' ? user2 : req.id === '3' ? user3 : user4,
    manuals: [manual1],
    commons: [],
    memos: [],
  };
  console.log(method, url, req, data);
  return [200, data]
};

export default postLogin;