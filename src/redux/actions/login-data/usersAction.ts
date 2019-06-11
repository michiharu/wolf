import actionCreatorFactory from 'typescript-fsa';
import User from '../../../data-types/user';

const actionCreator = actionCreatorFactory();

export const usersAction = {
  change:  actionCreator<User[]>('ACTIONS_USER_CHANGE'),
};