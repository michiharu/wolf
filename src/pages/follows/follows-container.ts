import { connect } from 'react-redux';
import { AppState } from '../../redux/store';
import FollowsComponent from './follows-component';

function mapStateToProps(appState: AppState) {
  return {...appState.follows, ...appState.users};
}

export default connect(mapStateToProps)(FollowsComponent);