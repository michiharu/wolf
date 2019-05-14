import { AxiosRequestConfig } from 'axios';

const deleteUser = (config: AxiosRequestConfig) => {
  const { method, url} = config;
  console.log(method, url);
  return [200];
};

export default deleteUser;