import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { categoriesAction } from '../../actions/login-data/categoriesAction';
import Category from '../../../data-types/category';

export interface CategoriesState {
  categories: Category[];
  filter: Category | null;
}

const initialState: CategoriesState = {
  categories: [],
  filter: null
};

export const categoriesReducer = reducerWithInitialState(initialState)
.case(categoriesAction.set, (state, categories) => ({...state, categories}))
.case(categoriesAction.filterSet, (state, filter) => ({...state, filter}))
.case(categoriesAction.filterReset, (state) => ({...state, filter: null}))