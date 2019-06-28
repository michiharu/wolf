import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../../redux/store';
import { Manual } from '../../../../data-types/tree';
import { manualAction } from '../../../../redux/actions/main/manualsAction';
import BaseSettingsComponent from './base-settings-component';
import { Action } from 'typescript-fsa';
import { titleCheckAction } from '../../../../redux/actions/titileCheckAction';

export interface BaseSettingsActions {
  replace: (manual: Manual) => Action<Manual>;
  titleReset: (params: {preTitle: string; willGenerate?: string}) => Action<{preTitle: string; willGenerate?: string}>;
}

function mapStateToProps(appState: AppState) {
  const { manuals, selectId } = appState.manuals;
  const manual = manuals.find(m => m.id === selectId)!;
  return {
    user: appState.loginUser.user!,
    manual,
    categories: appState.categories.categories,
    ...appState.titleCheck
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    replace: (manual: Manual) => dispatch(manualAction.put(manual)),
    titleReset: (params: {preTitle: string; willGenerate?: string}) => dispatch(titleCheckAction.set(params)) 
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BaseSettingsComponent);