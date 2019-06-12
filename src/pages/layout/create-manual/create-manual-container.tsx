import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../redux/store';
import { manualsAction } from '../../../redux/actions/main/manualsAction';
import { Manual } from '../../../data-types/tree';
import CreateManualComponent from './create-manual-component';

export interface CreateManualActions {
  add: (manuals: Manual) => Action<Manual>;
}

function mapStateToProps(appState: AppState) {
  return {user: appState.loginUser.user!, ...appState.categories};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    add: (manual: Manual) => dispatch(manualsAction.post(manual)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateManualComponent);
