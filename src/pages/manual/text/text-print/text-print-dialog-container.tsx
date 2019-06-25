import { connect } from 'react-redux';
import { AppState } from '../../../../redux/store';

import TextPrintDialogComponent from './text-print-dialog-component';

function mapStateToProps(appState: AppState) {
  const { selectNode } = appState.manuals;
  return {node: selectNode!};
}

export default connect(mapStateToProps)(TextPrintDialogComponent);