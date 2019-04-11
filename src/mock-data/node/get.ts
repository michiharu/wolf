import { AxiosRequestConfig } from 'axios';
import { NodeGetResponse } from '../../data-types/api';
import { Tree } from '../../data-types/tree-node';

export const nodeList: Tree[] = [];

const getNode = (config: AxiosRequestConfig) => {
  const { method, url } = config;
  const data: NodeGetResponse = nodeList;
  
  console.log(method, url, data);
  return [200, data]
};

export default getNode;