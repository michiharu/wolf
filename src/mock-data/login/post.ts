import { AxiosRequestConfig } from 'axios';
import { LoginPostResponse } from '../../data-types/api';

const postLogin = (config: AxiosRequestConfig) => {
  const { method, url, data: requestJson } = config;
  const req = JSON.parse(requestJson);

  const data: LoginPostResponse = {
    id: req.id,
    lastName: 'モック',
    firstName: '太郎'
  };
  console.log(method, url, req, data);
  return [200, data]
};

export default postLogin;