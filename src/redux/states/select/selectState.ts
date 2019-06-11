import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { selectActions } from '../../actions/select/selectAction';
import { Manual, TreeNode, Tree, baseTreeNode } from '../../../data-types/tree';
import TreeUtil from '../../../func/tree';
import TreeNodeUtil from '../../../func/tree-node';

export interface SelectState {
  manual: Manual | null;
  node: TreeNode | null;
}

const initialState: SelectState = {
  manual: null,
  node: null,
};

export const selectReducer = reducerWithInitialState(initialState)
.case(selectActions.set, (state, manual) => {
  const node = TreeNodeUtil._init(TreeUtil._get<Tree, TreeNode>(manual.rootTree!, baseTreeNode));
  node.label = manual.title;
  return ({...state, manual, node});
})
.case(selectActions.changeNode, (state, node) => ({...state, node}))
.case(selectActions.clear, (state) => ({...state, manual: null, node: null}))
