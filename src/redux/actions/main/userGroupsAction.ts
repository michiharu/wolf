import actionCreatorFactory from 'typescript-fsa';
import UserGroup from '../../../data-types/user-group';

const actionCreator = actionCreatorFactory();

export const userGroupsAction = {
  change:  actionCreator<UserGroup[]>('ACTIONS_USERGROUPS_CHANGE'),
};