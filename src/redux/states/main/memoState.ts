import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { memosActions } from '../../actions/main/memoAction';
import { Memo } from '../../../data-types/tree';

export interface MemosState {
  memos: Memo[];
}

const initialState: MemosState = {
  memos: []
};

export const memoReducer = reducerWithInitialState(initialState)
.case(memosActions.set, (state, memos) => ({...state, memos}))
.case(memosActions.change, (state, memos) => ({...state, memos}))
.case(memosActions.changeSuccess, (state, memos) => ({...state, memos}))