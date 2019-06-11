import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../../redux/store';
import { Manual } from '../../../../data-types/tree';
import { selectActions } from '../../../../redux/actions/select/selectAction';
import { manualsAction } from '../../../../redux/actions/login-data/manualsAction';
import BaseSettingsComponent from './base-settings-component';
import { Action } from 'typescript-fsa';

export interface BaseSettingsActions {
  replace: (manual: Manual) => Action<Manual>;
  set: (manual: Manual) => Action<Manual>;
}

function mapStateToProps(appState: AppState) {
  return {manual: appState.select.manual!, categories: appState.categories.categories};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    replace: (manual: Manual) => dispatch(manualsAction.put(manual)),
    set: (manual: Manual) => dispatch(selectActions.set(manual)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BaseSettingsComponent);