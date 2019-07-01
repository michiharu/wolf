import { connect } from 'react-redux';
import { AppState } from '../../../../redux/store';

import TextPrintDialogComponent from './text-print-dialog-component';

function mapStateToProps(appState: AppState) {
  const { node } = appState.manual;
  return {node: node!};
}

export default connect(mapStateToProps)(TextPrintDialogComponent);