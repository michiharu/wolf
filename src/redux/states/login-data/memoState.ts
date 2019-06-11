import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { memoActions } from '../../actions/login-data/memoAction';
import { KTreeNode } from '../../../data-types/tree';

export interface MemoState {
  memos: KTreeNode[];
}

const initialState: MemoState = {
  memos: []
};

export const memoReducer = reducerWithInitialState(initialState)
.case(memoActions.change, (state, memos) => ({...state, memos}))