import { reducerWithInitialState } from 'typescript-fsa-reducers';
import ReadingSetting from '../../data-types/reading-settings';
import { defaultRS } from '../../settings/reading';
import { rsActions } from '../actions/rsAction';

export interface RSState {
  rs: ReadingSetting;
}

const initialState: RSState = {
  rs: defaultRS
};

export const rsReducer = reducerWithInitialState(initialState)
.case(rsActions.change, (state, rs) => ({...state, rs}))
.case(rsActions.reset, (state) => ({...state, ks: defaultRS}))