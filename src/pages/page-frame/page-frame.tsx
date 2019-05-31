import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import links from '../../settings/links';
import Dashboard from '../dashboard/dashboard-component';
import { Theme, createStyles, WithStyles, withStyles } from '@material-ui/core';
import { fade } from '@material-ui/core/styles/colorManipulator';
import AppBarContainer from './app-bar/app-bar-container';
import ViewContainer from '../manual/view/view-container';
import EditorFrameContainer from '../manual/edit/editor-frame-container';
import RequestContainer from '../manual/request/request-container';
import FollowsContainer from '../follows/follows-container';

export const styles = (theme: Theme) => createStyles({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(9),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(10),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  toolbar: theme.mixins.toolbar,
  main: {},
});

interface Props extends WithStyles<typeof styles> {}

const PageFrame: React.FC<Props> = (props) => {
  const { classes } = props;
  return (
    <div>
      <AppBarContainer/>
      <main className={classes.main}>
        <div className={classes.toolbar}/>
        <Switch>
          <Route exact path={links.dashboard} render={() => <Dashboard/>}/>
          <Route exact path={links.follows} render={() => <FollowsContainer/>}/>
          <Route path={'/manual/:id/edit'} render={props => <EditorFrameContainer {...props}/>}/>
          <Route path={'/manual/:id/request/:requestId'} component={RequestContainer}/>
          <Route path={'/manual/:id/request/create'} component={RequestContainer}/>
          <Route path={'/manual/:id'}      render={props => <ViewContainer {...props}/>}/>
          <Redirect to={links.dashboard}/>
        </Switch>
      </main>
    </div>
  );
}

export default withStyles(styles)(PageFrame);
