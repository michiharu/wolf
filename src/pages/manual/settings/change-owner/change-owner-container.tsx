import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../../redux/store';
import { Manual } from '../../../../data-types/tree';
import { manualAction } from '../../../../redux/actions/main/manualsAction';
import ChangeOwnerComponent from './change-owner-component';
import { Action } from 'typescript-fsa';

export interface CollaboratorsActions {
  replace: (manual: Manual) => Action<Manual>;
}

function mapStateToProps(appState: AppState) {
  const { manual } = appState.manual;
  return {user: appState.loginUser.user!, ...appState.users, manual: manual!};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    replace: (manual: Manual) => dispatch(manualAction.put(manual)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangeOwnerComponent);