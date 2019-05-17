import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { selectActions } from '../actions/selectAction';
import { Manual, TreeNode } from '../../data-types/tree';

export interface SelectState {
  manual: Manual | null;
  node: TreeNode | null;
}

const initialState: SelectState = {
  manual: null,
  node: null,
};

export const selectReducer = reducerWithInitialState(initialState)
.case(selectActions.setManual, (state, manual) => ({...state, manual}))
.case(selectActions.setNode,   (state, node) => ({...state, node}))