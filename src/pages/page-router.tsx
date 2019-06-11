import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import links from '../settings/links';
import Dashboard from './dashboard/dashboard-component';
import ViewContainer from './manual/layout/layout-container';

interface Props {}

const PageRouter: React.FC<Props> = () => (
  <Switch>
    <Route exact path={links.dashboard} component={Dashboard}/>
    <Route path={'/manual/:id'} component={ViewContainer}/>
    <Redirect to={links.dashboard}/>
  </Switch>
);

export default PageRouter;
