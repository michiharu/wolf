import { AxiosRequestConfig } from 'axios';
import { ManualPostResponse, ManualPostRequest, ManualPutResponse, ManualDeleteResponse, ManualGetResponse } from '../definitions';
import Util from '../../func/util';
import cloneDeep from 'lodash/cloneDeep';
import { manual1, manual2, manual3, manual4, rootTree as tree } from './common-data/manuals';

export const get = (config: AxiosRequestConfig) => {
  const { method, url } = config;
  const reversedURL = [...url!].reduceRight((p, c) => p + c);
  const rootTree = cloneDeep(tree);
  const data: ManualGetResponse =
    reversedURL[0] === '1' ? {...manual1, rootTree} :
    reversedURL[0] === '2' ? {...manual2, rootTree} :
    reversedURL[0] === '3' ? {...manual3, rootTree} : {...manual4, rootTree};

  console.log(method, url, data);
  return [200, data]
};

export const post = (config: AxiosRequestConfig) => {
  const { method, url, data: requestJson } = config;
  const req = JSON.parse(requestJson) as ManualPostRequest;

  const data: ManualPostResponse = {
    ...req, id: `${Util.getID()}`
  };

  console.log(method, url, req, data);
  return [200, data]
};

export const put = (config: AxiosRequestConfig) => {
  const { method, url, data: requestJson } = config;
  const req = JSON.parse(requestJson) as ManualPostRequest;

  const data: ManualPutResponse = {...req};

  console.log(method, url, req, data);
  return [200, data]
};

export const _delete = (config: AxiosRequestConfig) => {
  const { method, url } = config;
  const data: ManualDeleteResponse = {};

  console.log(method, url, data);
  return [200, data]
};