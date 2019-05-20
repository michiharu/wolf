import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../../redux/store';
import NodeEditorComponent, { styles } from './node-editor-component';
import { withStyles } from '@material-ui/core';

export interface NodeEditorActions {
  
}

function mapStateToProps(appState: AppState) {
  return {...appState.ks, ...appState.rs};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {};
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NodeEditorComponent));