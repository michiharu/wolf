import { Manual, baseTree, baseManual } from "../../../data-types/tree";

export const manual1: Manual = {
  ...baseManual,
  id: '1',
  title: '企画マニュアル',
  description: 'ここには企画マニュアルの説明。ここにはマニュアルの説明。ここにはマニュアルの説明。',
  ownerId: 'a',
  collaboratorIds:[],
  categoryId: '1',
  favoriteIds: ['a'],
  likeIds: ['a', 'c', 'd'],
  rootTree: null,
};

export const manual2: Manual = {
  ...baseManual,
  id: '2',
  title: '営業マニュアル',
  description: 'ここには営業マニュアルの説明。ここにはマニュアルの説明。ここにはマニュアルの説明。',
  ownerId: 'a',
  collaboratorIds:['b'],
  categoryId: '2',
  favoriteIds: ['b', 'd'],
  likeIds: ['a'],
  rootTree: null,
};

export const manual3: Manual = {
  ...baseManual,
  id: '3',
  title: '人事マニュアル',
  description: 'ここには人事マニュアルの説明。ここにはマニュアルの説明。ここにはマニュアルの説明。',
  ownerId: 'c',
  collaboratorIds:['b'],
  categoryId: '3',
  favoriteIds: [],
  rootTree: null,  
};

export const manual4: Manual = {
  ...baseManual,
  id: '4',
  title: '企画マニュアル２',
  description: 'ここには企画マニュアル２の説明。ここにはマニュアルの説明。ここにはマニュアルの説明。',
  ownerId: 'a',
  collaboratorIds:['b'],
  categoryId: '1',
  favoriteIds: ['a', 'c', 'd'],
  likeIds: ['a', 'd'],
  rootTree: null,
};

export const rootTree = {
  ...baseTree,
  id: '5',
  label: '',
  children:[
    {...baseTree, id: '6', label: '手順１'},
    {...baseTree, id: '7', label: '手順２'},
    {...baseTree, id: '8', label: '手順３'},
  ]
}

