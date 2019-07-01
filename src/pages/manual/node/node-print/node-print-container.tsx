import { connect } from 'react-redux';
import { AppState } from '../../../../redux/store';
import NodePrintComponent from './node-print-component';

function mapStateToProps(appState: AppState) {
  const { node } = appState.manual;
  return {node: node!, ...appState.ks, ...appState.rs};
}

export default connect(mapStateToProps)(NodePrintComponent);