import { AxiosRequestConfig } from 'axios';
import { NodeGetResponse } from '../../data-types/api';
import TreeNode from '../../data-types/tree-node';

const node111: TreeNode = {
  type: 'task',
  id: '1-1-1',
  label: 'マニュアル１−１−１',
  input: '',
  output: '',
  preConditions: '',
  postConditions: '',
  workerInCharge: '',
  remarks: '',
  necessaryTools: '',
  exceptions: '',
  imageName: '',
  imageBlob: '',
  children: []
};

const node112: TreeNode = {
  type: 'task',
  id: '1-1-2',
  label: 'マニュアル１-１−２',
  input: '',
  output: '',
  preConditions: '',
  postConditions: '',
  workerInCharge: '',
  remarks: '',
  necessaryTools: '',
  exceptions: '',
  imageName: '',
  imageBlob: '',
  children: []
};
const node113: TreeNode = {
  type: 'task',
  id: '1-1-3',
  label: 'マニュアル１−１−３',
  input: '',
  output: '',
  preConditions: '',
  postConditions: '',
  workerInCharge: '',
  remarks: '',
  necessaryTools: '',
  exceptions: '',
  imageName: '',
  imageBlob: '',
  children: []
};
const node114: TreeNode = {
  type: 'task',
  id: '1-1-4',
  label: 'マニュアル１−１−４',
  input: '',
  output: '',
  preConditions: '',
  postConditions: '',
  workerInCharge: '',
  remarks: '',
  necessaryTools: '',
  exceptions: '',
  imageName: '',
  imageBlob: '',
  children: []
};

export const node11: TreeNode = {
  type: 'task',
  id: '1-1',
  label: 'マニュアル１−１',
  input: 'ファイルA',
  output: 'ファイルB',
  preConditions: '',
  postConditions: '',
  workerInCharge: '',
  remarks: '',
  necessaryTools: '',
  exceptions: '',
  imageName: '',
  imageBlob: '',
  children: [node111, node112, node113, node114]
};

const node1211: TreeNode = {
  type: 'task',
  id: '1-2-1-1',
  label: 'マニュアル１−2−１-1',
  input: '',
  output: '',
  preConditions: '',
  postConditions: '',
  workerInCharge: '',
  remarks: '',
  necessaryTools: '',
  exceptions: '',
  imageName: '',
  imageBlob: '',
  children: []
};

const node1212: TreeNode = {
  type: 'task',
  id: '1-2-1-2',
  label: 'マニュアル１−2−１-2',
  input: '',
  output: '',
  preConditions: '',
  postConditions: '',
  workerInCharge: '',
  remarks: '',
  necessaryTools: '',
  exceptions: '',
  imageName: '',
  imageBlob: '',
  children: []
};

const node121: TreeNode = {
  type: 'case',
  id: '1-2-1',
  label: 'マニュアル１−2−１',
  input: '',
  output: '',
  preConditions: '',
  postConditions: '',
  workerInCharge: '',
  remarks: '',
  necessaryTools: '',
  exceptions: '',
  imageName: '',
  imageBlob: '',
  children: [node1211, node1212]
};

const node122: TreeNode = {
  type: 'case',
  id: '1-2-2',
  label: 'マニュアル１-2−２',
  input: '',
  output: '',
  preConditions: '',
  postConditions: '',
  workerInCharge: '',
  remarks: '',
  necessaryTools: '',
  exceptions: '',
  imageName: '',
  imageBlob: '',
  children: []
};
const node123: TreeNode = {
  type: 'case',
  id: '1-2-3',
  label: 'マニュアル１−2−３',
  input: '',
  output: '',
  preConditions: '',
  postConditions: '',
  workerInCharge: '',
  remarks: '',
  necessaryTools: '',
  exceptions: '',
  imageName: '',
  imageBlob: '',
  children: []
};

const node12: TreeNode = {
  type: 'switch',
  id: '1-2',
  label: 'マニュアル１-２',
  input: '',
  output: '',
  preConditions: '',
  postConditions: '',
  workerInCharge: '',
  remarks: '',
  necessaryTools: '',
  exceptions: '',
  imageName: '',
  imageBlob: '',
  children: [node121, node122, node123]
};

const node13: TreeNode = {
  type: 'task',
  id: '1-3',
  label: 'マニュアル１−３',
  input: '',
  output: '',
  preConditions: '',
  postConditions: '',
  workerInCharge: '',
  remarks: '',
  necessaryTools: '',
  exceptions: '',
  imageName: '',
  imageBlob: '',
  children: []
};

export const node1: TreeNode = {
  type: 'task',
  id: '1',
  label: 'マニュアル１',
  input: '',
  output: '',
  preConditions: '',
  postConditions: '',
  workerInCharge: '',
  remarks: '',
  necessaryTools: '',
  exceptions: '',
  imageName: '',
  imageBlob: '',
  children: [node11, node12, node13]
};

const node21: TreeNode = {
  type: 'task',
  id: '2-1',
  label: 'マニュアル２−１',
  input: '',
  output: '',
  preConditions: '',
  postConditions: '',
  workerInCharge: '',
  remarks: '',
  necessaryTools: '',
  exceptions: '',
  imageName: '',
  imageBlob: '',
  children: []
};

const node22: TreeNode = {
  type: 'task',
  id: '2-2',
  label: 'マニュアル２-２',
  input: '',
  output: '',
  preConditions: '',
  postConditions: '',
  workerInCharge: '',
  remarks: '',
  necessaryTools: '',
  exceptions: '',
  imageName: '',
  imageBlob: '',
  children: []
};

const node23: TreeNode = {
  type: 'task',
  id: '2-3',
  label: 'マニュアル２−３',
  input: '',
  output: '',
  preConditions: '',
  postConditions: '',
  workerInCharge: '',
  remarks: '',
  necessaryTools: '',
  exceptions: '',
  imageName: '',
  imageBlob: '',
  children: []
};

const node2: TreeNode = {
  type: 'task',
  id: '2',
  label: 'マニュアル２',
  input: '',
  output: '',
  preConditions: '',
  postConditions: '',
  workerInCharge: '',
  remarks: '',
  necessaryTools: '',
  exceptions: '',
  imageName: '',
  imageBlob: '',
  children: [node21, node22, node23]
};

const node3: TreeNode = {
  type: 'task',
  id: '3',
  label: 'マニュアル３',
  input: '',
  output: '',
  preConditions: '',
  postConditions: '',
  workerInCharge: '',
  remarks: '',
  necessaryTools: '',
  exceptions: '',
  imageName: '',
  imageBlob: '',
  children: []
};

export const nodeList: TreeNode[] = [node1, node2, node3];

const getNode = (config: AxiosRequestConfig) => {
  const { method, url } = config;
  const data: NodeGetResponse = nodeList;
  
  console.log(method, url, data);
  return [200, data]
};

export default getNode;