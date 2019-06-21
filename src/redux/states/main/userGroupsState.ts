import { reducerWithInitialState } from 'typescript-fsa-reducers';
import UserGroup from '../../../data-types/user-group';
import { userGroupsAction } from '../../actions/main/userGroupsAction';

export interface UserGroupsState {
  userGroups: UserGroup[];
}

const initialState: UserGroupsState = {
  userGroups: []
};

export const userGroupsReducer = reducerWithInitialState(initialState)
.case(userGroupsAction.change, (state, userGroups) => ({...state, userGroups}))