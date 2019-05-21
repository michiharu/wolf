import { Manual, baseTree, baseManual } from "../../../data-types/tree";

export const manual1: Manual = {
  ...baseManual,
  id: '1',
  label: 'マニュアル１',
  ownerId: '1',
  collaboratorIds:['2', '3'],
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