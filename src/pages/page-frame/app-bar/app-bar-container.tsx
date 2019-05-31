import { connect } from 'react-redux';
import { AppState } from '../../../redux/store';
import AppBarComponent from './app-bar-component';

function mapStateToProps(appState: AppState) {
  return {user: appState.loginUser.user!};
}

export default connect(mapStateToProps)(AppBarComponent);
