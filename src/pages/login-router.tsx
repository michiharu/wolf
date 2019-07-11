import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../redux/store';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import links from '../settings/links';
import LoginContainer from './login/login-container';
import { LoginUserState } from '../redux/states/main/loginUserState';
import LayoutContainer from './layout/layout-container';
import NowLoading from '../components/now-loading';
import { loginUserAction } from '../redux/actions/main/loginUserAction';
import { Dispatch } from 'redux';
import { Action } from 'typescript-fsa';


interface Props extends LoginUserState {
  startSessionCheck: () => Action<void>,
}

const LoginRouter: React.FC<Props> = ({ user, sessionChecked, startSessionCheck }) => {

  useEffect(() => {
    startSessionCheck();
  }, [startSessionCheck]);

  return (
    <BrowserRouter>
      <Switch>
        {user === null && !sessionChecked && <Route render={() => <NowLoading hasDrawer={false} />} />}
        {user === null && <Route exact path={links.login} component={LoginContainer} />}
        {user === null && <Redirect to={links.login} />}
        <Route component={LayoutContainer} />
      </Switch>
    </BrowserRouter>
  );
}

function mapStateToProps(appState: AppState) {
  return { ...appState.loginUser };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    startSessionCheck: () => dispatch(loginUserAction.startSessionCheck()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginRouter);
