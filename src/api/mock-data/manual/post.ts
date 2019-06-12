import { AxiosRequestConfig } from 'axios';
import { ManualPostResponse, ManualPostRequest } from '../../definitions';
import Util from '../../../func/util';

const postManual = (config: AxiosRequestConfig) => {
  const { method, url, data: requestJson } = config;
  const req = JSON.parse(requestJson) as ManualPostRequest;

  const data: ManualPostResponse = {
    ...req, id: `${Util.getID()}`
  };

  console.log(method, url, req, data);
  return [200, data]
};

export default postManual;