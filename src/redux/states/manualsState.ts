import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { manualsAction } from '../actions/manualsAction';
import { Manual } from '../../data-types/tree';

export interface ManualsState {
  manuals: Manual[];
}

const initialState: ManualsState = {
  manuals: []
};

export const manualsReducer = reducerWithInitialState(initialState)
.case(manualsAction.change, (state, manuals) => ({...state, manuals}))