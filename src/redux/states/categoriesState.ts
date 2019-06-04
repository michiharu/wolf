import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { categoriesAction } from '../actions/categoriesAction';
import Category from '../../data-types/category';

export interface CategoriesState {
  categories: Category[];
}

const initialState: CategoriesState = {
  categories: []
};

export const categoriesReducer = reducerWithInitialState(initialState)
.case(categoriesAction.change, (state, categories) => ({...state, categories}))