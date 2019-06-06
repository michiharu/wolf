import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../redux/store';
import KSize from '../../data-types/k-size';
import { ksActions } from '../../redux/actions/ksAction';
import ReadingSetting from '../../data-types/reading-settings';
import { rsActions } from '../../redux/actions/rsAction';
import ViewSettingsComponent from './view-settings-component';


export interface ViewSettingsActions {
  changeKS: (ks: KSize) => Action<KSize>;
  resetKS:  () => Action<KSize>;
  changeRS: (rs: ReadingSetting) => Action<ReadingSetting>,
  resetRS:  () => Action<ReadingSetting>,
}

function mapStateToProps(appState: AppState) {
  return {...appState.ks, ...appState.rs};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    changeKS:  (ks: KSize) => dispatch<Action>(ksActions.change(ks)),
    resetKS:   () => dispatch<Action>(ksActions.reset()),
    changeRS:  (rs: ReadingSetting) => dispatch<Action>(rsActions.change(rs)),
    resetRS:   () => dispatch<Action>(rsActions.reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewSettingsComponent);