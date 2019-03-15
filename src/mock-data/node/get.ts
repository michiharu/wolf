import { AxiosRequestConfig } from 'axios';
import { NodeGetResponse } from '../../data-types/api';
import TreeNode from '../../data-types/tree-node';

const node111: TreeNode = {
  type: 'task',
  id: '1-1-1',
  label: 'マニュアル１−１−１',
  input: '',
  output: '',
  children: []
};

const node112: TreeNode = {
  type: 'task',
  id: '1-1-2',
  label: 'マニュアル１-１−２',
  input: '',
  output: '',
  children: []
};
const node113: TreeNode = {
  type: 'task',
  id: '1-1-3',
  label: 'マニュアル１−１−３',
  input: '',
  output: '',
  children: []
};
const node114: TreeNode = {
  type: 'task',
  id: '1-1-4',
  label: 'マニュアル１−１−４',
  input: '',
  output: '',
  children: []
};

export const node11: TreeNode = {
  type: 'task',
  id: '1-1',
  label: 'マニュアル１−１',
  input: 'ファイルA',
  output: 'ファイルB',
  children: [node111, node112, node113, node114]
};

const node1211: TreeNode = {
  type: 'task',
  id: '1-2-1-1',
  label: 'マニュアル１−2−１-1',
  input: '',
  output: '',
  children: []
};

const node1212: TreeNode = {
  type: 'task',
  id: '1-2-1-2',
  label: 'マニュアル１−2−１-2',
  input: '',
  output: '',
  children: []
};

const node121: TreeNode = {
  type: 'task',
  id: '1-2-1',
  ifState: 'ケースその１',
  label: 'マニュアル１−2−１',
  input: '',
  output: '',
  children: [node1211, node1212]
};

const node122: TreeNode = {
  type: 'task',
  id: '1-2-2',
  ifState: 'ケースその２',
  label: 'マニュアル１-2−２',
  input: '',
  output: '',
  children: []
};
const node123: TreeNode = {
  type: 'task',
  id: '1-2-3',
  ifState: 'ケースその３',
  label: 'マニュアル１−2−３',
  input: '',
  output: '',
  children: []
};

const node12: TreeNode = {
  type: 'switch',
  id: '1-2',
  label: 'マニュアル１-２',
  input: '',
  output: '',
  children: [node121, node122, node123]
};

const node13: TreeNode = {
  type: 'task',
  id: '1-3',
  label: 'マニュアル１−３',
  input: '',
  output: '',
  children: []
};

export const node1: TreeNode = {
  type: 'task',
  id: '1',
  label: 'マニュアル１',
  input: '',
  output: '',
  children: [node11, node12, node13]
};

const node21: TreeNode = {
  type: 'task',
  id: '2-1',
  label: 'マニュアル２−１',
  input: '',
  output: '',
  children: []
};

const node22: TreeNode = {
  type: 'task',
  id: '2-2',
  label: 'マニュアル２-２',
  input: '',
  output: '',
  children: []
};

const node23: TreeNode = {
  type: 'task',
  id: '2-3',
  label: 'マニュアル２−３',
  input: '',
  output: '',
  children: []
};

const node2: TreeNode = {
  type: 'task',
  id: '2',
  label: 'マニュアル２',
  input: '',
  output: '',
  children: [node21, node22, node23]
};

const node3: TreeNode = {
  type: 'task',
  id: '3',
  label: 'マニュアル３',
  input: '',
  output: '',
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