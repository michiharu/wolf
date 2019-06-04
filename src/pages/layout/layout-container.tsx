import { connect } from 'react-redux';
import { AppState } from '../../redux/store';
import AppFrameComponent from './layout-component';

function mapStateToProps(appState: AppState) {
  return {user: appState.loginUser.user!};
}

export default connect(mapStateToProps)(AppFrameComponent);
