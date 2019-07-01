import React, { useEffect } from 'react';
import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../redux/store';
import { ManualState } from       '../../../redux/states/main/manualsState';

import { RouteComponentProps } from 'react-router-dom';
import {  Manual } from '../../../data-types/tree';

import LayoutComponent from './layout-component';
import { CategoriesState } from '../../../redux/states/main/categoriesState';
import User from '../../../data-types/user';
import { manualAction } from '../../../redux/actions/main/manualsAction';

import { FavoritePostRequestParams, FavoriteDeleteRequestParams, LikePostRequestParams, LikeDeleteRequestParams } from '../../../api/definitions';
import { ksActions } from '../../../redux/actions/ksAction';
import { KSState } from '../../../redux/states/ksState';
import { UsersState } from '../../../redux/states/main/usersState';

export interface ViewActions {
  get: (id: string) => Action<string>;
  replace: (manual: Manual) => Action<Manual>;
  postFavorite: (params: FavoritePostRequestParams) => Action<FavoritePostRequestParams>,
  deleteFavorite: (params: FavoriteDeleteRequestParams) => Action<FavoriteDeleteRequestParams>,
  postLike: (params: LikePostRequestParams) => Action<LikePostRequestParams>,
  deleteLike: (params: LikeDeleteRequestParams) => Action<LikeDeleteRequestParams>,
  clear: () => Action<void>;
  editStart: () => Action<void>;
  zoomIn: () => Action<void>;
  zoomOut: () => Action<void>;
}

interface Props extends
  ManualState,
  UsersState,
  CategoriesState,
  KSState,
  ViewActions,
  RouteComponentProps<{id: string}> {
    user: User;
  }

const ViewContainer: React.FC<Props> = props => {
  const {
    user,
    manual,
    users,
    node,
    ks,
    match,
    get,
    replace,
    postFavorite,
    deleteFavorite,
    postLike,
    deleteLike,

    zoomIn,
    zoomOut,
  } =  props;

  // eslint-disable-next-line
  useEffect(() => { get(match.params.id); }, []);
  

  if (manual === null) { return <></>; }

  const componentProps = {
    user,
    manual,
    users,
    selectNode: node,
    ks,
    replace,
    postFavorite,
    deleteFavorite,
    postLike,
    deleteLike,
    zoomIn,
    zoomOut,
  };
  return <LayoutComponent {...componentProps}/>;
}

function mapStateToProps(appState: AppState) {
  return {
    user: appState.loginUser.user!,
    ...appState.manual,
    ...appState.users,
    ...appState.categories,
    ...appState.ks
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    get: (id: string) => dispatch(manualAction.get(id)),
    replace: (manual: Manual) => dispatch(manualAction.put(manual)),
    postFavorite: (params: FavoritePostRequestParams) => dispatch(manualAction.checkFavorite(params)),
    deleteFavorite: (params: FavoriteDeleteRequestParams) => dispatch(manualAction.uncheckFavorite(params)),
    postLike: (params: LikePostRequestParams) => dispatch(manualAction.checkLike(params)),
    deleteLike: (params: LikeDeleteRequestParams) => dispatch(manualAction.uncheckLike(params)),

    zoomIn: () => dispatch(ksActions.zoomIn()),
    zoomOut: () => dispatch(ksActions.zoomOut()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewContainer);