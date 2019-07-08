import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { loadingActions } from '../actions/loadingAction';

export interface LoadingState {
  loginLoading: boolean;
  manualLoading: boolean;
}

const initialState: LoadingState = {
  loginLoading: false,
  manualLoading: false,
};

export const loadingReducer = reducerWithInitialState(initialState)
.case(loadingActions.beginLogin, (state) => ({...state, loginLoading: true}))
.case(loadingActions.endLogin, (state) => ({...state, loginLoading: false}))
.case(loadingActions.beginManual, (state) => ({...state, manualLoading: true}))
.case(loadingActions.endManual, (state) => ({...state, manualLoading: false}))
