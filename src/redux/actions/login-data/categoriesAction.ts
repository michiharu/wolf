import actionCreatorFactory from 'typescript-fsa';
import Category from '../../../data-types/category';

const actionCreator = actionCreatorFactory();

export const categoriesAction = {
  set: actionCreator<Category[]>('ACTIONS_CATEGORIES_SET'),
  filterSet: actionCreator<Category>('ACTIONS_CATEGORY_FILTER_SET'),
  filterReset: actionCreator<void>('ACTIONS_CATEGORY_FILTER_RESET'),
};
