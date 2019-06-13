import { AxiosRequestConfig } from 'axios';
import { ManualPostResponse, ManualPostRequest, ManualPutResponse, ManualDeleteResponse } from '../definitions';
import Util from '../../func/util';

export const postManual = (config: AxiosRequestConfig) => {
  const { method, url, data: requestJson } = config;
  const req = JSON.parse(requestJson) as ManualPostRequest;

  const data: ManualPostResponse = {
    ...req, id: `${Util.getID()}`
  };

  console.log(method, url, req, data);
  return [200, data]
};

export const putManual = (config: AxiosRequestConfig) => {
  const { method, url, data: requestJson } = config;
  const req = JSON.parse(requestJson) as ManualPostRequest;

  const data: ManualPutResponse = {...req};

  console.log(method, url, req, data);
  return [200, data]
};

export const deleteManual = (config: AxiosRequestConfig) => {
  const { method, url } = config;
  const data: ManualDeleteResponse = {};

  console.log(method, url, data);
  return [200, data]
};