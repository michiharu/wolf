import * as React from 'react';
import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../redux/store';
import { ManualsState } from       '../../../redux/states/main/manualsState';

import { RouteComponentProps } from 'react-router-dom';
import {  Manual } from '../../../data-types/tree';

import LayoutComponent from './layout-component';
import { CategoriesState } from '../../../redux/states/main/categoriesState';
import User from '../../../data-types/user';
import { manualsAction, selectActions, favoriteActions } from '../../../redux/actions/main/manualsAction';
import { viewAction } from '../../../redux/actions/viewAction';
import { ViewState } from '../../../redux/states/viewState';

export interface ViewActions {
  replace: (manual: Manual) => Action<Manual>;
  postFavorite: (userId: string) => Action<string>,
  set: (manual: Manual) => Action<Manual>;
  editStart: () => Action<void>;
}

interface Props extends
  ManualsState,
  CategoriesState,
  ViewState,
  ViewActions,
  RouteComponentProps<{id: string}> {
    user: User;
  }

const ViewContainer: React.FC<Props> = props => {
  const { user, manuals, selectId, isEditing, match, set, replace, postFavorite, editStart } =  props;

  if (selectId !== match.params.id) {
    const selected = manuals.find(m => m.id === match.params.id)!;
    set(selected);
  }
  const id = selectId || match.params.id;
  const manual = manuals.find(m => m.id === id)!;
  const componentProps = {user, manual, isEditing, replace, postFavorite, set, editStart};
  return <LayoutComponent {...componentProps}/>;
}

function mapStateToProps(appState: AppState) {
  return {
    user: appState.loginUser.user!,
    ...appState.manuals,
    ...appState.categories,
    ...appState.view,
    ...appState.ks
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    replace: (manual: Manual) => dispatch(manualsAction.put(manual)),
    postFavorite: (userId: string) => dispatch(favoriteActions.post(userId)),
    set: (manual: Manual) => dispatch(selectActions.select(manual)),
    editStart: () => dispatch(viewAction.editStart()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewContainer);