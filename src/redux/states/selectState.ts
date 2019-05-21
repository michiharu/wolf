import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { selectActions } from '../actions/selectAction';
import { Manual, TreeNode, PullRequest } from '../../data-types/tree';

export interface SelectState {
  manual: Manual | null;
  node: TreeNode | null;
  request: PullRequest | null;
  reqNode: TreeNode | null;
}

const initialState: SelectState = {
  manual: null,
  node: null,
  request: null,
  reqNode: null,
};

export const selectReducer = reducerWithInitialState(initialState)
.case(selectActions.setManual, (state, manual) => ({...state, manual}))
.case(selectActions.clearManual, (state) => ({...state, manual: null}))
.case(selectActions.setNode,   (state, node) => ({...state, node}))
.case(selectActions.setRequest,   (state, request) => ({...state, request}))
.case(selectActions.clearRequest,   (state) => ({...state, request: null}))
.case(selectActions.setReqNode,   (state, reqNode) => ({...state, reqNode}))