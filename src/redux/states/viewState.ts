import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { viewAction } from '../actions/viewAction'

export interface ViewState {
  isEditing: boolean;
}

const initialState: ViewState = {
  isEditing: false,
};

export const viewReducer = reducerWithInitialState(initialState)
.case(viewAction.editStart, (state) => ({...state, isEditing: true}))
.case(viewAction.editEnd, (state) => ({...state, isEditing: false}))
