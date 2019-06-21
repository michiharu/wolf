import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../redux/store';
import ProfileComponent from './profile-component';
import { LoginUser } from '../../../data-types/user';
import { loginUserAction } from '../../../redux/actions/main/loginUserAction';
import { notificationsAction } from '../../../redux/actions/notificationsAction';
import { MyNotification } from '../../../redux/states/notificationsState';

export interface ProfileActions {
  update: (user: LoginUser) => Action<LoginUser>;
  enqueue: (notification: MyNotification) => Action<MyNotification>;
}

function mapStateToProps(appState: AppState) {
  return {user: appState.loginUser.user!};
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    update: (user: LoginUser) => dispatch(loginUserAction.put(user)),
    enqueue: (notification: MyNotification) => dispatch(notificationsAction.enqueue(notification)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileComponent);
