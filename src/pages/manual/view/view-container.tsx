import * as React from 'react';
import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../redux/store';
import { ManualsState } from       '../../../redux/states/manualsState';
import { SelectState } from '../../../redux/states/selectState';
import { selectActions } from '../../../redux/actions/selectAction';

import { RouteComponentProps } from 'react-router-dom';
import {  Manual } from '../../../data-types/tree';

import ViewComponent from './view-component';
import { CategoriesState } from '../../../redux/states/categoriesState';
import User from '../../../data-types/user';
import { manualsAction } from '../../../redux/actions/manualsAction';

export interface ViewActions {
  replace: (manual: Manual) => Action<Manual>;
  set: (manual: Manual) => Action<Manual>;
}

interface Props extends
  ManualsState,
  CategoriesState,
  SelectState,
  ViewActions, RouteComponentProps<{id: string}> {
    user: User;
  }

const ViewContainer: React.FC<Props> = props => {
  const { user, manuals, manual, set, replace, match } =  props;

  if (manual === null || manual.id !== match.params.id) {
    const selected = manuals.find(m => m.id === match.params.id)!;
    set(selected);
    return <p>loading...</p>
  }
  const componentProps = {user, manual, replace, set};
  return <ViewComponent {...componentProps}/>;
}

function mapStateToProps(appState: AppState) {
  return {user: appState.loginUser.user!, ...appState.manuals, ...appState.categories, ...appState.select, ...appState.ks};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    replace: (manual: Manual) => dispatch(manualsAction.replace(manual)),
    set: (manual: Manual) => dispatch(selectActions.set(manual)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewContainer);