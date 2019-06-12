import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../../redux/store';
import { Manual } from '../../../../data-types/tree';
import { manualsAction } from '../../../../redux/actions/main/manualsAction';
import DeleteComponent from './delete-component';
import { Action } from 'typescript-fsa';

export interface DeleteActions {
  manualDelete: (manual: Manual) => Action<Manual>;
}

function mapStateToProps(appState: AppState) {
  const { manuals, selectId } = appState.manuals;
  const manual = manuals.find(m => m.id === selectId)!;
  return {manual};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    manualDelete: (manual: Manual) => dispatch(manualsAction.delete(manual)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteComponent);