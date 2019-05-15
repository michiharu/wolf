import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { manualActions } from '../actions/manualAction';
import { Tree } from '../../data-types/tree-node';

export interface ManualState {
  manuals: Tree[];
}

const initialState: ManualState = {
  manuals: []
};

export const manualReducer = reducerWithInitialState(initialState)
.case(manualActions.change, (state, manuals) => ({...state, manuals}))