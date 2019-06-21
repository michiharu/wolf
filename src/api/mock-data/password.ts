import { AxiosRequestConfig } from 'axios';
import { Password } from '../../data-types/password';

export const putPassword = (config: AxiosRequestConfig) => {
  const { method, url, data: requestJson } = config;
  const req = JSON.parse(requestJson) as Password;

  console.log(method, url, req);
  return [200]
};