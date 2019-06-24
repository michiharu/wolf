import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { ksActions } from '../actions/ksAction';
import KSize from '../../data-types/k-size';
import { defaultKS } from '../../settings/layout';
import keys from '../../settings/storage-keys';

export interface KSState {
  ks: KSize;
}

const ksString = localStorage.getItem(keys.ks);
const ks = ksString !== null ? JSON.parse(ksString) as KSize : defaultKS;
const initialState: KSState = { ks };

export const ksReducer = reducerWithInitialState(initialState)
.case(ksActions.change, (state, ks) => ({...state, ks}))
.case(ksActions.reset, (state) => ({...state, ks: defaultKS}))
.case(ksActions.zoomIn, (state) => ({...state, ks: {...state.ks, unit: state.ks.unit + 2}}))
.case(ksActions.zoomOut, (state) => ({...state, ks: {...state.ks, unit: state.ks.unit - 2}}))
