import { AxiosRequestConfig } from 'axios';
import { MemosPutRequest, MemosPutResponse } from '../definitions';

export const putMemos = (config: AxiosRequestConfig) => {
  const { method, url, data: requestJson } = config;
  const req = JSON.parse(requestJson) as MemosPutRequest;

  const data: MemosPutResponse = req.map(m => ({...m, id: String(Math.random())}));

  console.log(method, url, req, data);
  return [200, data]
};