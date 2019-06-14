import { AxiosRequestConfig } from 'axios';
import { TreePutRequest, TreePutResponse } from '../definitions';

export const putTree = (config: AxiosRequestConfig) => {
  const { method, url, data: requestJson } = config;
  const req = JSON.parse(requestJson) as TreePutRequest;

  const data: TreePutResponse = {...req.rootTree};

  console.log(method, url, req, data);
  return [200, data]
};