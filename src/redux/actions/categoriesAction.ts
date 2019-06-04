import actionCreatorFactory from 'typescript-fsa';
import Category from '../../data-types/category';

const actionCreator = actionCreatorFactory();

export const categoriesAction = {
  change: actionCreator<Category[]>('ACTIONS_CATEGORIES_CHANGE')
};