import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../../redux/store';
import { Manual } from '../../../../data-types/tree';
import { manualsAction } from '../../../../redux/actions/login-data/manualsAction';
import DeleteComponent from './delete-component';
import { Action } from 'typescript-fsa';

export interface DeleteActions {
  manualDelete: (manual: Manual) => Action<Manual>;
}

function mapStateToProps(appState: AppState) {
  return {...appState.manuals, select: appState.select.manual!};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    manualDelete: (manual: Manual) => dispatch(manualsAction.delete(manual)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteComponent);