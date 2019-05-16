import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { manualActions } from '../actions/manualAction';
import { Manual } from '../../data-types/tree';

export interface ManualState {
  manuals: Manual[];
}

const initialState: ManualState = {
  manuals: []
};

export const manualReducer = reducerWithInitialState(initialState)
.case(manualActions.change, (state, manuals) => ({...state, manuals}))