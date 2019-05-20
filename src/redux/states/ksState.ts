import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { ksActions } from '../actions/ksAction';
import KSize from '../../data-types/k-size';
import { defaultKS } from '../../settings/layout';

export interface KSState {
  ks: KSize;
}

const initialState: KSState = {
  ks: defaultKS
};

export const ksReducer = reducerWithInitialState(initialState)
.case(ksActions.change, (state, ks) => ({...state, ks}))
.case(ksActions.reset, (state) => ({...state, ks: defaultKS}))