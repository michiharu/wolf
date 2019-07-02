import { AxiosRequestConfig } from 'axios';
import { TreePutResponse } from '../definitions';

export const putTree = (config: AxiosRequestConfig) => {
  const { method, url, data: requestJson } = config;
  const req = JSON.parse(requestJson);

  const data: TreePutResponse = {...req};

  console.log(method, url, req, data);
  return [200, data]
};