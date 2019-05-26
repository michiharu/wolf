import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { Manual } from '../../data-types/tree';
import { followsAction } from '../actions/followsAction';

export interface FollowsState {
  follows: Manual[];
}

const initialState: FollowsState = {
  follows: []
};

export const followsReducer = reducerWithInitialState(initialState)
.case(followsAction.change, (state, follows) => ({...state, follows}))