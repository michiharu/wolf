import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { loadingActions } from '../actions/loadingAction';

export interface LoadingState {
  loginLoading: boolean;
  manualsLoading: boolean;
  manualLoading: boolean;
}

const initialState: LoadingState = {
  loginLoading: false,
  manualsLoading: false,
  manualLoading: false,
};

export const loadingReducer = reducerWithInitialState(initialState)
.case(loadingActions.beginLogin, (state) => ({...state, loginLoading: true}))
.case(loadingActions.endLogin, (state) => ({...state, loginLoading: false}))

.case(loadingActions.beginManualQuery, (state) => ({...state, manualsLoading: true}))
.case(loadingActions.endManualQuery, (state) => ({...state, manualsLoading: false}))

.case(loadingActions.beginManual, (state) => ({...state, manualLoading: true}))
.case(loadingActions.endManual, (state) => ({...state, manualLoading: false}))
