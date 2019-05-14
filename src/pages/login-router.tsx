import * as React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import User from '../data-types/user';
import Login from './login/login';
import { RootState } from './state-manager';
import links from '../settings/links';
import PageRouter, { PageRouterProps } from './page-router';

export interface LoginRouterProps extends PageRouterProps {
  user: User | null;
  login: (rootState: RootState) => void;
}

const LoginRouter: React.SFC<LoginRouterProps> = (props) => (
  <BrowserRouter>
    <Switch>
      {props.user === null &&
      <Route exact path={links.login} render={() => <Login login={props.login}/>}/>}
      {props.user === null &&
      <Redirect to={links.login}/>}
      <Route
        render={routerProps =>
          <PageRouter {...routerProps} {...props}/>
        }
      />
    </Switch>
  </BrowserRouter>
);

export default LoginRouter;
