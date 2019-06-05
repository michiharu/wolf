import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { selectActions } from '../actions/selectAction';
import { Manual, TreeNode, Tree, baseTreeNode } from '../../data-types/tree';
import TreeUtil from '../../func/tree';

export interface SelectState {
  manual: Manual | null;
  node: TreeNode | null;
}

const initialState: SelectState = {
  manual: null,
  node: null,
};

export const selectReducer = reducerWithInitialState(initialState)
.case(selectActions.set, (state, manual) => ({
  ...state, manual, node: TreeUtil._get<Tree, TreeNode>(manual.rootTree!, baseTreeNode)
}))
.case(selectActions.changeNode, (state, node) => ({...state, node}))
.case(selectActions.clear, (state) => ({...state, manual: null, node: null}))
