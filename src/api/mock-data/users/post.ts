import { AxiosRequestConfig } from 'axios';
import { UserPostRequest } from '../../definitions';
import User from '../../../data-types/user';

const postUser = (config: AxiosRequestConfig) => {
  const { method, url, data: requestJson } = config;
  const req = JSON.parse(requestJson) as User;

  const data: UserPostRequest = req;
  console.log(method, url, req, data);
  return [200, data]
};

export default postUser;