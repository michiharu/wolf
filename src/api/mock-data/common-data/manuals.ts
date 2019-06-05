import { Manual, baseTree, baseManual } from "../../../data-types/tree";

export const manual1: Manual = {
  ...baseManual,
  id: '1',
  title: '企画マニュアル',
  ownerId: '1',
  collaboratorIds:['2'],
  
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
  ownerId: '1',
  collaboratorIds:['2'],
  
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
  ownerId: '1',
  collaboratorIds:['2'],
  
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