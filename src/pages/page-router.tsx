import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import links from '../settings/links';
import Dashboard from './dashboard/dashboard-component';
import ViewContainer from './manual/view/view-container';
import EditorFrameContainer from './manual/edit/editor-frame-container';

interface Props {}

const PageRouter: React.FC<Props> = () => (
  <Switch>
    <Route exact path={links.dashboard} render={() => <Dashboard/>}/>
    <Route path={'/manual/:id/edit'} component={EditorFrameContainer}/>
    <Route path={'/manual/:id'}      render={props => <ViewContainer {...props}/>}/>
    <Redirect to={links.dashboard}/>
  </Switch>
);

export default PageRouter;
