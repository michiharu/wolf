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
import { manualsAction, selectActions, favoriteActions, likeActions } from '../../../redux/actions/main/manualsAction';
import { viewAction } from '../../../redux/actions/viewAction';
import { ViewState } from '../../../redux/states/viewState';
import { FavoritePostRequestParams, FavoriteDeleteRequestParams, LikePostRequestParams, LikeDeleteRequestParams } from '../../../api/definitions';

export interface ViewActions {
  get: (manual: Manual) => Action<Manual>;
  replace: (manual: Manual) => Action<Manual>;
  postFavorite: (params: FavoritePostRequestParams) => Action<FavoritePostRequestParams>,
  deleteFavorite: (params: FavoriteDeleteRequestParams) => Action<FavoriteDeleteRequestParams>,
  postLike: (params: LikePostRequestParams) => Action<LikePostRequestParams>,
  deleteLike: (params: LikeDeleteRequestParams) => Action<LikeDeleteRequestParams>,
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
  const {
    user,
    manuals,
    selectId,
    isEditing,
    match,
    get,
    set,
    replace,
    postFavorite,
    deleteFavorite,
    postLike,
    deleteLike,
    editStart,
  } =  props;

  if (selectId !== match.params.id) {
    const selected = manuals.find(m => m.id === match.params.id)!;
    get(selected)
    set(selected);
  }
  const id = selectId || match.params.id;
  const manual = manuals.find(m => m.id === id)!;
  const componentProps = {
    user,
    manual,
    isEditing,
    replace,
    postFavorite,
    deleteFavorite,
    postLike,
    deleteLike,
    set,
    editStart
  };
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
    get: (manual: Manual) => dispatch(manualsAction.get(manual)),
    replace: (manual: Manual) => dispatch(manualsAction.put(manual)),
    postFavorite: (params: FavoritePostRequestParams) => dispatch(favoriteActions.post(params)),
    deleteFavorite: (params: FavoriteDeleteRequestParams) => dispatch(favoriteActions.delete(params)),
    postLike: (params: LikePostRequestParams) => dispatch(likeActions.post(params)),
    deleteLike: (params: LikeDeleteRequestParams) => dispatch(likeActions.delete(params)),
    set: (manual: Manual) => dispatch(selectActions.select(manual)),
    editStart: () => dispatch(viewAction.editStart()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewContainer);