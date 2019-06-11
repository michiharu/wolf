import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory();

export const viewAction = {
  editStart: actionCreator<void>('ACTIONS_EDIT_START'),
  editEnd: actionCreator<void>('ACTIONS_EDIT_END'),
};