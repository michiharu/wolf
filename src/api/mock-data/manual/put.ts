import { AxiosRequestConfig } from 'axios';
import { ManualPostRequest, ManualPutResponse } from '../../definitions';

const putManual = (config: AxiosRequestConfig) => {
  const { method, url, data: requestJson } = config;
  const req = JSON.parse(requestJson) as ManualPostRequest;

  const data: ManualPutResponse = {...req};

  console.log(method, url, req, data);
  return [200, data]
};

export default putManual;