import { Manual, baseTree, baseManual } from "../../../data-types/tree";

export const manual1: Manual = {
  ...baseManual,
  id: '1',
  label: 'マニュアル１',
  ownerId: '1',
  collaboratorIds:['2'],
  pullRequests: [
    {
      ...baseTree,
      id: '2',
      originalId: '1',
      writerId: '3',
      requestMessage: 'お願いします',
      responseMessage: null,
      children: [
        {
          ...baseTree,
          id: '2-1',
          originalId: '1-1',
          label: 'マニュ',
          children: []
        },
        {
          ...baseTree,
          id: '2-2',
          originalId: '1-2',
          label: 'マニュ2',
          children: []
        },
      ]
    }
  ],
  children: [
    {...baseTree, id: '1-1', label: 'マニュアル１−１'},
    {...baseTree, id: '1-2', label: 'マニュアル１−２'},
    {...baseTree, id: '1-3', label: 'マニュアル１−３'},
  ]
};

export const manual2: Manual = {
  ...baseManual,
  id: '2',
  label: 'マニュアル２',
  ownerId: '1',
  collaboratorIds:['4'],
  children: [
    {...baseTree, id: '2-1', label: 'マニュアル２−１'},
    {...baseTree, id: '2-2', label: 'マニュアル２−２'},
    {...baseTree, id: '2-3', label: 'マニュアル２−３'},
  ]
};

export const manual3: Manual = {
  ...baseManual,
  id: '3',
  label: 'マニュアル３',
  ownerId: '3',
  collaboratorIds:[],
  children: [
    {...baseTree, id: '3-1', label: 'マニュアル3−１'},
    {...baseTree, id: '3-2', label: 'マニュアル3−２'},
    {...baseTree, id: '3-3', label: 'マニュアル3−３'},
  ]
};