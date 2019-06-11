import * as React from 'react';
import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../redux/store';
import { ManualsState } from       '../../../redux/states/login-data/manualsState';
import { SelectState } from '../../../redux/states/select/selectState';
import { selectActions } from '../../../redux/actions/select/selectAction';

import { RouteComponentProps } from 'react-router-dom';
import {  Manual } from '../../../data-types/tree';

import LayoutComponent from './layout-component';
import { CategoriesState } from '../../../redux/states/login-data/categoriesState';
import User from '../../../data-types/user';
import { manualsAction } from '../../../redux/actions/login-data/manualsAction';
import { viewAction } from '../../../redux/actions/viewAction';
import { ViewState } from '../../../redux/states/viewState';

export interface ViewActions {
  replace: (manual: Manual) => Action<Manual>;
  set: (manual: Manual) => Action<Manual>;
  editStart: () => Action<void>;
}

interface Props extends
  ManualsState,
  CategoriesState,
  SelectState,
  ViewState,
  ViewActions,
  RouteComponentProps<{id: string}> {
    user: User;
  }

const ViewContainer: React.FC<Props> = props => {
  const { user, manuals, manual, isEditing, match, set, replace, editStart } =  props;

  if (manual === null || manual.id !== match.params.id) {
    const selected = manuals.find(m => m.id === match.params.id)!;
    set(selected);
    return <p>loading...</p>
  }
  const componentProps = {user, manual, isEditing, replace, set, editStart};
  return <LayoutComponent {...componentProps}/>;
}

function mapStateToProps(appState: AppState) {
  return {
    user: appState.loginUser.user!,
    ...appState.manuals,
    ...appState.categories,
    ...appState.select,
    ...appState.view,
    ...appState.ks};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    replace: (manual: Manual) => dispatch(manualsAction.replace(manual)),
    set: (manual: Manual) => dispatch(selectActions.set(manual)),
    editStart: () => dispatch(viewAction.editStart()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewContainer);