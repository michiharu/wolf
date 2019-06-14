import { Manual, baseTree, baseManual } from "../../../data-types/tree";

export const manual1: Manual = {
  ...baseManual,
  id: '1',
  title: '企画マニュアル',
  description: 'ここには企画マニュアルの説明。ここにはマニュアルの説明。ここにはマニュアルの説明。',
  ownerId: '1',
  collaboratorIds:['2'],
  categoryId: '1',
  favoriteIds: ['1'],
  likeIds: ['1', '3', '4'],
  rootTree: null,
};

export const manual2: Manual = {
  ...baseManual,
  id: '2',
  title: '営業マニュアル',
  description: 'ここには営業マニュアルの説明。ここにはマニュアルの説明。ここにはマニュアルの説明。',
  ownerId: '1',
  collaboratorIds:['2'],
  categoryId: '2',
  favoriteIds: ['2', '4'],
  likeIds: ['1'],
  rootTree: null,
};

export const manual3: Manual = {
  ...baseManual,
  id: '3',
  title: '人事マニュアル',
  description: 'ここには人事マニュアルの説明。ここにはマニュアルの説明。ここにはマニュアルの説明。',
  ownerId: '1',
  collaboratorIds:['2'],
  categoryId: '3',
  favoriteIds: [],
  rootTree: null,  
};

export const manual4: Manual = {
  ...baseManual,
  id: '4',
  title: '企画マニュアル２',
  description: 'ここには企画マニュアル２の説明。ここにはマニュアルの説明。ここにはマニュアルの説明。',
  ownerId: '1',
  collaboratorIds:['2'],
  categoryId: '1',
  favoriteIds: ['1', '3', '4'],
  likeIds: ['1', '4'],
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

