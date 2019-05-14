import { AxiosRequestConfig } from 'axios';
import { UserPutRequest } from '../../definitions';
import User from '../../../data-types/user';

const putUser = (config: AxiosRequestConfig) => {
  const { method, url, data: requestJson } = config;
  const req = JSON.parse(requestJson) as User;

  const data: UserPutRequest = req;
  console.log(method, url, req, data);
  return [200, data]
};

export default putUser;