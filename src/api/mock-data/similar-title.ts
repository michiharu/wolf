import { AxiosRequestConfig } from 'axios';
import { SimilarTitleRequest, SimilarTitleResponse } from '../definitions';

export const postSimilarTitle = (config: AxiosRequestConfig) => {
  const { method, url, data: requestJson } = config;
  const req = JSON.parse(requestJson) as SimilarTitleRequest;
  const data: SimilarTitleResponse = {
    newTitle: req.original + Math.floor(Math.random() * 1000)
  }
  console.log(method, url, req, data);
  return [200, data]
};