import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { manualsAction, selectActions, favoriteActions } from '../../actions/main/manualsAction';
import { Manual, TreeNode, Tree, baseTreeNode } from '../../../data-types/tree';
import cloneDeep from 'lodash/cloneDeep';
import TreeNodeUtil from '../../../func/tree-node';
import TreeUtil from '../../../func/tree';

export interface ManualsState {
  manuals: Manual[];
  selectId: string | null;
  selectNode: TreeNode | null;
  manualBeforeSaving: Manual[];
  favoriteBeforeSaving: string | null;
}

const initialState: ManualsState = {
  manuals: [],
  selectId: null,
  selectNode: null,
  manualBeforeSaving: [],
  favoriteBeforeSaving: null,
};

export const manualsReducer = reducerWithInitialState(initialState)
.case(
  manualsAction.set,
  (state, manuals) => ({...state, manuals})
)
// POST
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
//PUT
.case(
  manualsAction.put,
  (state, manual) => {
    const cloneManual = cloneDeep({...manual, beforeSaving: true});
    const selectNode = TreeNodeUtil._init(TreeUtil._get<Tree, TreeNode>(cloneManual.rootTree!, baseTreeNode));
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
    const selectNode = TreeNodeUtil._init(TreeUtil._get<Tree, TreeNode>(cloneManual.rootTree!, baseTreeNode));
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
    const selectNode = TreeNodeUtil._init(TreeUtil._get<Tree, TreeNode>(before.rootTree!, baseTreeNode));
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
.case(selectActions.select, (state, manual) => {
  const cloneManual = cloneDeep(manual);
  const selectNode = TreeNodeUtil._init(TreeUtil._get<Tree, TreeNode>(cloneManual.rootTree!, baseTreeNode));
  selectNode.label = cloneManual.title;
  return ({...state, selectId: manual.id, selectNode});
})
.case(selectActions.update, (state, node) => ({...state, selectNode: cloneDeep(node)}))
.case(selectActions.clear, (state) => ({...state, selectId: null, selectNode: null}))

// POST FAVORITE
.case(
  favoriteActions.post,
  (state, userId) => {
    const { manuals, selectId } = state;
    const newManuals = manuals.map(m => {
      if (m.id === selectId) { m.favoriteIds.push(userId); }
      return m;
    });
    return ({
      ...state,
      manuals: newManuals,
      favoriteBeforeSaving: userId
    });
  }
)
.case(
  favoriteActions.postSuccess,
  (state) => {
    return ({...state, favoriteBeforeSaving: null});
  }
)
.case(
  favoriteActions.postError,
  (state) => {
    const { manuals, selectId, favoriteBeforeSaving: userId } = state;
    const newManuals = manuals.map(m => {
      if (m.id === selectId) { m.favoriteIds = m.favoriteIds.filter(fid => fid !== userId); }
      return m;
    });
    return ({
      ...state,
      manuals: newManuals,
      favoriteBeforeSaving: null
    });
  }
)
// DELETE FAVORITE
.case(
  favoriteActions.delete,
  (state, userId) => {
    const { manuals, selectId } = state;
    const newManuals = manuals.map(m => {
      if (m.id === selectId) { m.favoriteIds = m.favoriteIds.filter(fid => fid !== userId); }
      return m;
    });
    return ({
      ...state,
      manuals: newManuals,
      favoriteBeforeSaving: userId
    });
  }
)
.case(
  favoriteActions.postSuccess,
  (state) => {
    return ({...state, favoriteBeforeSaving: null});
  }
)
.case(
  favoriteActions.deleteError,
  (state) => {
    const { manuals, selectId, favoriteBeforeSaving: userId } = state;
    const newManuals = manuals.map(m => {
      if (m.id === selectId) { m.favoriteIds.push(userId!); }
      return m;
    });
    return ({
      ...state,
      manuals: newManuals,
      favoriteBeforeSaving: null
    });
  }
)