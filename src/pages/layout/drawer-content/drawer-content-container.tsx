import { connect } from 'react-redux';
import { AppState } from '../../../redux/store';
import DrawerContentComponent from './drawer-content-component';

function mapStateToProps(appState: AppState) {
  return {...appState.categories, ...appState.manuals};
}

export default connect(mapStateToProps)(DrawerContentComponent);
