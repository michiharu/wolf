import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../redux/store';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import links from '../settings/links';
import LoginContainer from './login/login-container';
import { LoginUserState } from '../redux/states/loginUserState';
import PageFrame from './page-frame/page-frame';
import { user1 } from '../api/mock-data/common-data/users';


interface Props extends LoginUserState {}

const LoginRouter: React.SFC<Props> = (props) => (
  <BrowserRouter>
    <Switch>
      {props.user === null && <Route exact path={links.login} render={() => <LoginContainer/>}/>}
      {props.user === null && <Redirect to={links.login}/>}
      <Route render={() => <PageFrame/>}/>
    </Switch>
  </BrowserRouter>
);

function mapStateToProps(appState: AppState) {
  return appState.loginUser;
}

export default connect(mapStateToProps)(LoginRouter);
