import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../redux/store';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import User from '../data-types/user';
import { RootState } from './state-manager';
import links from '../settings/links';
import PageRouter from './page-router';
import LoginContainer from './login/login-container';
import { LoginState } from '../redux/states/loginState';


interface Props extends LoginState {}

const LoginRouter: React.SFC<Props> = (props) => (
  <BrowserRouter>
    <Switch>
      {props.user === null && <Route exact path={links.login} render={() => <LoginContainer/>}/>}
      {props.user === null && <Redirect to={links.login}/>}
      <Route render={() => <PageRouter />}/>
    </Switch>
  </BrowserRouter>
);

function mapStateToProps(appState: AppState) {
  return appState.login;
}

export default connect(mapStateToProps)(LoginRouter);
