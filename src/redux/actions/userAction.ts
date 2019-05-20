import actionCreatorFactory from 'typescript-fsa';
import User from '../../data-types/user';

const actionCreator = actionCreatorFactory();

export const userActions = {
  set:  actionCreator<User[]>('ACTIONS_User_SET'),
};