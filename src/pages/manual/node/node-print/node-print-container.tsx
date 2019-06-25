import { connect } from 'react-redux';
import { AppState } from '../../../../redux/store';
import NodePrintComponent from './node-print-component';

function mapStateToProps(appState: AppState) {
  const { selectNode } = appState.manuals;
  return {node: selectNode!, ...appState.ks, ...appState.rs};
}

export default connect(mapStateToProps)(NodePrintComponent);