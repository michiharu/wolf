import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { manualsAction, selectActions, favoriteActions, likeActions, treeActions } from '../../actions/main/manualsAction';
import { Manual, TreeNode, Tree, baseTreeNode } from '../../../data-types/tree';
import cloneDeep from 'lodash/cloneDeep';
import TreeNodeUtil from '../../../func/tree-node';
import TreeUtil from '../../../func/tree';

export interface ManualsState {
  manuals: Manual[];
  requestGet: boolean;
  selectId: string | null;
  selectNode: TreeNode | null;
  manualBeforeSaving: Manual[];
  favoriteBeforeSaving: { manualId: string; userId: string; }[];
  likeBeforeSaving: { manualId: string; userId: string; }[];
  treeBeforeSaving: { manualId: string; tree: TreeNode | null; }[];
}

const initialState: ManualsState = {
  manuals: [],
  requestGet: false,
  selectId: null,
  selectNode: null,
  manualBeforeSaving: [],
  favoriteBeforeSaving: [],
  likeBeforeSaving: [],
  treeBeforeSaving: [],
};

export const manualsReducer = reducerWithInitialState(initialState)
.case(
  manualsAction.set,
  (state, manuals) => ({...state, manuals})
)
// GET
.case(
  manualsAction.get,
  (state, manualId) => {
    return ({ ...state, requestGet: true, selectId: manualId, selectNode: null })
  }
)
.case(
  manualsAction.getSuccess,
  (state, manual) => {
    const selectNode = manual.rootTree !== null
      ? TreeNodeUtil._init(TreeUtil._get<Tree, TreeNode>(manual.rootTree!, baseTreeNode))
      : {...baseTreeNode};

    selectNode.label = manual.title;

    return ({ ...state, requestGet: false, manuals: state.manuals.map(m => m.id === manual.id ? manual : m), selectNode})
  }
)
.case(
  manualsAction.getError,
  (state) => ({ ...state, requestGet: false})
)
// POST for copy
.case(
  manualsAction.postForCopy,
  (state, manual) => {
    const cloneManual = cloneDeep({...manual, beforeSaving: true});
    return ({
      ...state,
      manuals: state.manuals.concat([cloneManual]),
      manualBeforeSaving: state.manualBeforeSaving.concat([cloneManual])
    })
  }
)
.case(
  manualsAction.postSuccess,
  (state, {beforeId, manual}) => {
    const cloneManual = cloneDeep({...manual, beforeSaving: false});
    return ({
      ...state,
      manuals: state.manuals.map(m => m.id === beforeId ? cloneManual : m),
      manualBeforeSaving: state.manualBeforeSaving.filter(m => m.id !== beforeId)
    })
  }
)
.case(
  manualsAction.postError,
  (state, beforeId) => ({
      ...state,
    manuals: state.manuals.filter(m => m.id !== beforeId),
    manualBeforeSaving: state.manualBeforeSaving.filter(m => m.id !== beforeId)
  })
)
.case(
  manualsAction.post,
  (state, manual) => {
    const cloneManual = cloneDeep({...manual, beforeSaving: true});
    return ({
      ...state,
      manuals: state.manuals.concat([cloneManual]),
      manualBeforeSaving: state.manualBeforeSaving.concat([cloneManual])
    })
  }
)
//PUT
.case(
  manualsAction.put,
  (state, manual) => {
    const cloneManual = cloneDeep({...manual, beforeSaving: true});
    const selectNode = cloneManual.rootTree !== null
      ? TreeNodeUtil._init(TreeUtil._get<Tree, TreeNode>(cloneManual.rootTree!, baseTreeNode))
      : null;
    if (selectNode !== null) { selectNode.label = cloneManual.title; }
    const beforeManual = state.manuals.find(m => m.id === manual.id)!

    return ({
      ...state,
      manuals: state.manuals.map(m => m.id === cloneManual.id ? cloneManual : m),
      selectNode,
      manualBeforeSaving: state.manualBeforeSaving.concat([beforeManual])
    })
  }
)
.case(
  manualsAction.putSuccess,
  (state, {beforeId, manual}) => {
    const cloneManual = cloneDeep({...manual, beforeSaving: false});
    const selectNode = cloneManual.rootTree !== null
    ? TreeNodeUtil._init(TreeUtil._get<Tree, TreeNode>(cloneManual.rootTree!, baseTreeNode))
    : null;
    if (selectNode !== null) { selectNode.label = cloneManual.title; }

    return ({
      ...state,
      manuals: state.manuals.map(m => m.id === beforeId ? cloneManual : m),
      selectId: cloneManual.id,
      selectNode,
      manualBeforeSaving: state.manualBeforeSaving.filter(m => m.id !== beforeId)
    })
  }
)
.case(
  manualsAction.putError,
  (state, beforeId) => {
    const before = state.manualBeforeSaving.find(m => m.id === beforeId)!
    const selectNode = before.rootTree !== null
    ? TreeNodeUtil._init(TreeUtil._get<Tree, TreeNode>(before.rootTree!, baseTreeNode))
    : null;
    if (selectNode !== null) { selectNode.label = before.title; }

    return {
      ...state,
      manuals: state.manuals.map(m => m.id === beforeId ? before : m),
      selectNode,
      manualBeforeSaving: state.manualBeforeSaving.filter(m => m.id !== beforeId)
    };
  }
)
// DELETE
.case(
  manualsAction.delete,
  (state, manual) => {
    const cloneManual = cloneDeep(manual);
    return ({
      ...state,
      manuals: state.manuals.filter(m => m.id !== manual.id),
      manualBeforeSaving: state.manualBeforeSaving.concat([cloneManual])
    })
  }
)
.case(
  manualsAction.deleteSuccess,
  (state, beforeId) => ({
    ...state,
    manualBeforeSaving: state.manualBeforeSaving.filter(m => m.id !== beforeId)
  })
)
.case(
  manualsAction.deleteError,
  (state, beforeId) => {
    const before = state.manualBeforeSaving.find(m => m.id === beforeId)!
    return {
      ...state,
      manuals: state.manuals.concat([before]),
      manualBeforeSaving: state.manualBeforeSaving.filter(m => m.id !== beforeId)
    };
  }
)
// SELECT
.case(selectActions.update, (state, node) => ({...state, selectNode: cloneDeep(node)}))
.case(selectActions.clear, (state) => ({...state, selectNode: null}))

// POST FAVORITE
.case(
  favoriteActions.post,
  (state, {manualId, userId}) => {
    const { manuals, favoriteBeforeSaving } = state;
    const newManuals = manuals.map(m => {
      if (m.id === manualId) { m.favoriteIds.push(userId); }
      return m;
    });
    return ({
      ...state,
      manuals: newManuals,
      favoriteBeforeSaving: favoriteBeforeSaving.concat([{manualId, userId}]),
    });
  }
)
.case(
  favoriteActions.postSuccess,
  (state, manualId) => {
    const { favoriteBeforeSaving: before } = state;
    const favoriteBeforeSaving = before.filter(b => b.manualId !== manualId);
    return ({...state, favoriteBeforeSaving});
  }
)
.case(
  favoriteActions.postError,
  (state, manualId) => {
    const { manuals, favoriteBeforeSaving: before } = state;
    const {userId} = before.find(b => b.manualId === manualId)!;
    const newManuals = manuals.map(m => {
      if (m.id === manualId) { m.favoriteIds = m.favoriteIds.filter(fid => fid !== userId); }
      return m;
    });
    const favoriteBeforeSaving = before.filter(b => b.manualId !== manualId);
    return ({...state, manuals: newManuals, favoriteBeforeSaving});
  }
)
// DELETE FAVORITE
.case(
  favoriteActions.delete,
  (state, {manualId, userId}) => {
    const { manuals, favoriteBeforeSaving } = state;
    const newManuals = manuals.map(m => {
      if (m.id === manualId) { m.favoriteIds = m.favoriteIds.filter(fid => fid !== userId); }
      return m;
    });
    return ({
      ...state,
      manuals: newManuals,
      favoriteBeforeSaving: favoriteBeforeSaving.concat([{manualId, userId}])
    });
  }
)
.case(
  favoriteActions.postSuccess,
  (state, manualId) => {
    const { favoriteBeforeSaving: before } = state;
    const favoriteBeforeSaving = before.filter(b => b.manualId !== manualId);
    return ({...state, favoriteBeforeSaving});
  }
)
.case(
  favoriteActions.deleteError,
  (state, manualId) => {
    const { manuals, favoriteBeforeSaving: before } = state;
    const {userId} = before.find(b => b.manualId === manualId)!;
    const newManuals = manuals.map(m => {
      if (m.id === manualId) { m.favoriteIds.push(userId!); }
      return m;
    });
    const favoriteBeforeSaving = before.filter(b => b.manualId !== manualId);
    return ({...state, manuals: newManuals, favoriteBeforeSaving});
  }
)
// POST LIKE
.case(
  likeActions.post,
  (state, {manualId, userId}) => {
    const { manuals, likeBeforeSaving } = state;
    const newManuals = manuals.map(m => {
      if (m.id === manualId) { m.likeIds.push(userId); }
      return m;
    });
    return ({
      ...state,
      manuals: newManuals,
      likeBeforeSaving: likeBeforeSaving.concat([{manualId, userId}]),
    });
  }
)
.case(
  likeActions.postSuccess,
  (state, manualId) => {
    const { likeBeforeSaving: before } = state;
    const likeBeforeSaving = before.filter(b => b.manualId !== manualId);
    return ({...state, likeBeforeSaving});
  }
)
.case(
  likeActions.postError,
  (state, manualId) => {
    const { manuals, likeBeforeSaving: before } = state;
    const {userId} = before.find(b => b.manualId === manualId)!;
    const newManuals = manuals.map(m => {
      if (m.id === manualId) { m.likeIds = m.likeIds.filter(fid => fid !== userId); }
      return m;
    });
    const likeBeforeSaving = before.filter(b => b.manualId !== manualId);
    return ({...state, manuals: newManuals, likeBeforeSaving});
  }
)
// DELETE LIKE
.case(
  likeActions.delete,
  (state, {manualId, userId}) => {
    const { manuals, likeBeforeSaving } = state;
    const newManuals = manuals.map(m => {
      if (m.id === manualId) { m.likeIds = m.likeIds.filter(fid => fid !== userId); }
      return m;
    });
    return ({
      ...state,
      manuals: newManuals,
      likeBeforeSaving: likeBeforeSaving.concat([{manualId, userId}])
    });
  }
)
.case(
  likeActions.postSuccess,
  (state, manualId) => {
    const { likeBeforeSaving: before } = state;
    const likeBeforeSaving = before.filter(b => b.manualId !== manualId);
    return ({...state, likeBeforeSaving});
  }
)
.case(
  likeActions.deleteError,
  (state, manualId) => {
    const { manuals, likeBeforeSaving: before } = state;
    const {userId} = before.find(b => b.manualId === manualId)!;
    const newManuals = manuals.map(m => {
      if (m.id === manualId) { m.likeIds.push(userId!); }
      return m;
    });
    const likeBeforeSaving = before.filter(b => b.manualId !== manualId);
    return ({...state, manuals: newManuals, likeBeforeSaving});
  }
)
// PUT TREE
.case(
  treeActions.put,
  (state, {manualId, rootTree}) => {
    const cloneTree = cloneDeep(rootTree);
    const { manuals, selectNode: before, treeBeforeSaving } = state;
    const newManuals = manuals.map(m => {
      if (m.id === manualId) {
        m.rootTree = cloneTree
      }
      return m;
    });
    const selectNode = TreeNodeUtil._init(TreeUtil._get<Tree, TreeNode>(cloneTree, baseTreeNode));
    return ({
      ...state,
      manuals: newManuals,
      selectNode,
      treeBeforeSaving: treeBeforeSaving.concat([{manualId, tree: before}]),
    });
  }
)
.case(
  treeActions.putSuccess,
  (state, manualId) => {
    const { treeBeforeSaving: before } = state;
    const treeBeforeSaving = before.filter(b => b.manualId !== manualId);
    return ({...state, treeBeforeSaving});
  }
)
.case(
  treeActions.putError,
  (state, manualId) => {
    const { manuals, treeBeforeSaving: before } = state;
    const {tree} = before.find(b => b.manualId === manualId)!;
    const newManuals = manuals.map(m => {
      if (m.id === manualId) { m.rootTree = tree; }
      return m;
    });
    const treeBeforeSaving = before.filter(b => b.manualId !== manualId);
    return ({...state, manuals: newManuals, selectNode: tree, treeBeforeSaving});
  }
)
// PUT TREE for copy
.case(
  treeActions.putForCopy,
  (state, {manualId, rootTree}) => {
    const cloneTree = cloneDeep(rootTree);
    const { manuals, selectNode: before, treeBeforeSaving } = state;
    const newManuals = manuals.map(m => {
      if (m.id === manualId) {
        m.rootTree = cloneTree
      }
      return m;
    });
    const selectNode = TreeNodeUtil._init(TreeUtil._get<Tree, TreeNode>(cloneTree, baseTreeNode));
    return ({
      ...state,
      manuals: newManuals,
      selectNode,
      treeBeforeSaving: treeBeforeSaving.concat([{manualId, tree: before}]),
    });
  }
)