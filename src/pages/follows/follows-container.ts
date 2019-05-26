import { connect } from 'react-redux';
import { AppState } from '../../redux/store';
import { withStyles } from '@material-ui/core';
import FollowsComponent, { styles } from './follows-component';

function mapStateToProps(appState: AppState) {
  return {...appState.follows, ...appState.users};
}

export default withStyles(styles)(connect(mapStateToProps)(FollowsComponent));