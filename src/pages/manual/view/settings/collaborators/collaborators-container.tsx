import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../../../redux/store';
import { Manual } from '../../../../../data-types/tree';
import { selectActions } from '../../../../../redux/actions/selectAction';
import { manualsAction } from '../../../../../redux/actions/manualsAction';
import CollaboratorsComponent from './collaborators-component';
import { Action } from 'typescript-fsa';

export interface CollaboratorsActions {
  replace: (manual: Manual) => Action<Manual>;
  set: (manual: Manual) => Action<Manual>;
}

function mapStateToProps(appState: AppState) {
  return {...appState.users, manual: appState.select.manual!};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    replace: (manual: Manual) => dispatch(manualsAction.replace(manual)),
    set: (manual: Manual) => dispatch(selectActions.set(manual)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CollaboratorsComponent);