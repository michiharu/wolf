import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../../redux/store';
import { Manual } from '../../../../data-types/tree';
import { manualAction } from '../../../../redux/actions/main/manualsAction';
import DeleteComponent from './delete-component';
import { Action } from 'typescript-fsa';

export interface DeleteActions {
  manualDelete: (manual: Manual) => Action<Manual>;
}

function mapStateToProps(appState: AppState) {
  const { manual } = appState.manual;
  return {user: appState.loginUser.user!, manual: manual!};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    manualDelete: (manual: Manual) => dispatch(manualAction.delete(manual)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteComponent);