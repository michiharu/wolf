import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { loadingActions } from '../actions/loadingAction';

export interface LoadingState {
  loginLoading: boolean;
}

const initialState: LoadingState = {
  loginLoading: false,
};

export const loadingReducer = reducerWithInitialState(initialState)
.case(loadingActions.beginLogin, (state) => ({...state, loginLoading: true}))
.case(loadingActions.endLogin, (state) => ({...state, loginLoading: false}))
