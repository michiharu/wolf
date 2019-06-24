import { AxiosRequestConfig } from 'axios';
import { GenerateTitleRequest, GenerateTitleResponse } from '../definitions';

export const postGenerateTitle = (config: AxiosRequestConfig) => {
  const { method, url, data: requestJson } = config;
  const req = JSON.parse(requestJson) as GenerateTitleRequest;
  const data: GenerateTitleResponse = {
    title: `${req.title} のコピー(${Math.ceil(Math.random() * 10)})`,
    valid: true,
  }
  console.log(method, url, req, data);
  return [200, data]
};