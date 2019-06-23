import { AxiosRequestConfig } from 'axios';
import { TitleCheckPostResponse } from '../definitions';

export const postTitleCheck = (config: AxiosRequestConfig) => {
  const { method, url, data: requestJson } = config;
  const req = JSON.parse(requestJson) as { title: string };
  const data: TitleCheckPostResponse = {
    title: req.title,
    valid: Math.random() > 0.3
  }
  console.log(method, url, req, data);
  return [200, data]
};