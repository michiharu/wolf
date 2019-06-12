import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../../redux/store';
import { Manual } from '../../../../data-types/tree';
import { manualsAction } from '../../../../redux/actions/main/manualsAction';
import BaseSettingsComponent from './base-settings-component';
import { Action } from 'typescript-fsa';

export interface BaseSettingsActions {
  replace: (manual: Manual) => Action<Manual>;
}

function mapStateToProps(appState: AppState) {
  const { manuals, selectId } = appState.manuals;
  const manual = manuals.find(m => m.id === selectId)!;
  return {manual, categories: appState.categories.categories};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    replace: (manual: Manual) => dispatch(manualsAction.put(manual)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BaseSettingsComponent);