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
  rootTree: {
    ...baseTree,
    id: '1',
    label: 'マニュアル１',
    children:[
      {...baseTree, id: '1-1', label: 'マニュアル１−１'},
      {...baseTree, id: '1-2', label: 'マニュアル１−２'},
      {...baseTree, id: '1-3', label: 'マニュアル１−３'},
    ]
  }
};

export const manual11: Manual = {
  ...baseManual,
  id: '11',
  title: '企画マニュアル２',
  description: 'ここには企画マニュアル２の説明。ここにはマニュアルの説明。ここにはマニュアルの説明。',
  ownerId: '1',
  collaboratorIds:['2'],
  categoryId: '1',
  favoriteIds: ['1', '3', '4'],
  rootTree: {
    ...baseTree,
    id: '1',
    label: 'マニュアル１',
    children:[
      {...baseTree, id: '1-1', label: 'マニュアル１−１'},
      {...baseTree, id: '1-2', label: 'マニュアル１−２'},
      {...baseTree, id: '1-3', label: 'マニュアル１−３'},
    ]
  }
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
  rootTree: {
    ...baseTree,
    id: '2',
    label: 'マニュアル２',
    children: [
      {...baseTree, id: '2-1', label: 'マニュアル２−１'},
      {...baseTree, id: '2-2', label: 'マニュアル２−２'},
      {...baseTree, id: '2-3', label: 'マニュアル２−３'},
    ]
  }
};

export const manual3: Manual = {
  ...baseManual,
  id: '3',
  title: '人事マニュアル',
  description: 'ここには人事マニュアルの説明。ここにはマニュアルの説明。ここにはマニュアルの説明。',
  ownerId: '1',
  collaboratorIds:['2'],
  categoryId: '3',
  rootTree: {
    ...baseTree,
    id: '3',
    label: 'マニュアル３',
    children: [
      {...baseTree, id: '3-1', label: 'マニュアル3−１'},
      {...baseTree, id: '3-2', label: 'マニュアル3−２'},
      {...baseTree, id: '3-3', label: 'マニュアル3−３'},
    ]
  }
};