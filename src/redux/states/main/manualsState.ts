import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { manualAction, treeActions } from '../../actions/main/manualsAction';
import { Manual, TreeNode, Tree, baseTreeNode } from '../../../data-types/tree';
import cloneDeep from 'lodash/cloneDeep';
import TreeNodeUtil from '../../../func/tree-node';
import TreeUtil from '../../../func/tree';

export interface ManualState {
  manual: Manual | null;
  node: TreeNode | null;
}

const initialState: ManualState = {
  manual: null,
  node: null,
};

export const manualsReducer = reducerWithInitialState(initialState)

// GET
.case(
  manualAction.get,
  (state) => ({ ...state, requestGet: true, manual: null, node: null })
)
.case(
  manualAction.getSuccess,
  (state, manual) => {
    const node = manual.rootTree !== null
      ? TreeNodeUtil._init(TreeUtil._get<Tree, TreeNode>(manual.rootTree!, baseTreeNode))
      : {...baseTreeNode};
    node.label = manual.title;

    return ({ ...state, requestGet: false, manual, node})
  }
)

//PUT
.case(
  manualAction.put,
  (state, manual) => {
    const cloneManual = cloneDeep(manual);
    const node = cloneManual.rootTree !== null
      ? TreeNodeUtil._init(TreeUtil._get<Tree, TreeNode>(cloneManual.rootTree!, baseTreeNode))
      : null;
    if (node !== null) { node.label = cloneManual.title; }

    return ({
      ...state,
      manual: cloneManual,
      node,
    })
  }
)
.case(
  manualAction.putSuccess,
  (state, manual) => {
    const cloneManual = cloneDeep(manual);
    const node = cloneManual.rootTree !== null
    ? TreeNodeUtil._init(TreeUtil._get<Tree, TreeNode>(cloneManual.rootTree!, baseTreeNode))
    : null;
    if (node !== null) { node.label = cloneManual.title; }

    return ({
      ...state,
      manual: cloneManual,
      node,
    })
  }
)

.case(manualAction.clear, (state) => ({...state, manual: null, node: null}))

// PUT TREE
.case(
  treeActions.put,
  (state, node) => {
    return ({
      ...state,
      manual: {...state.manual!, rootTree: node},
      node,
    });
  }
)
.case(
  treeActions.putSuccess,
  (state, tree) => {
    const node = tree !== null
    ? TreeNodeUtil._init(TreeUtil._get<Tree, TreeNode>(tree, baseTreeNode))
    : null;
    if (node !== null) { node.label = state.manual!.title; }
    return ({
      ...state,
      manual: {...state.manual!, rootTree: node},
      node,
    });
  }
)