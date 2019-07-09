import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../redux/store';
import NodeEditorComponent from './node-component';

export interface NodeEditorActions {
  
}

function mapStateToProps(appState: AppState) {
  return {...appState.ks, ...appState.rs};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(NodeEditorComponent);