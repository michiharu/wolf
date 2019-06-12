import { connect } from 'react-redux';
import { AppState } from '../../../redux/store';
import ExpansionListItemComponent from './expansion-list-item-component';
import { Dispatch } from 'redux';
import { categoriesAction } from '../../../redux/actions/main/categoriesAction';
import Category from '../../../data-types/category';
import { Action } from 'typescript-fsa';

export interface ExpansionActions {
  filterSet: (category: Category) => Action<Category>;
  filterReset: () => Action<void>;
}

function mapStateToProps(appState: AppState) {
  return {filter: appState.categories.filter};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    filterSet: (category: Category) => dispatch(categoriesAction.filterSet(category)),
    filterReset: () => dispatch(categoriesAction.filterReset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExpansionListItemComponent);
