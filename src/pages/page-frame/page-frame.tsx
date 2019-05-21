import * as React from 'react';
import {useState} from 'react';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import links from '../../settings/links';
import Dashboard from '../dashboard/dashboard-component';
import { Theme, createStyles, WithStyles, Toolbar, Button, Tabs, Tab, InputBase, withStyles, IconButton, Badge, Typography } from '@material-ui/core';
import { Search, Notifications } from '@material-ui/icons';
import { fade } from '@material-ui/core/styles/colorManipulator';
import AppBarContainer from './app-bar/app-bar-container';
import ViewContainer from '../manual/view/view-container';
import EditorFrameContainer from '../manual/edit/editor-frame-container';
import RequestContainer from '../manual/request/request-container';
import User from '../../data-types/user';

export const styles = (theme: Theme) => createStyles({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
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
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
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

  const [searchText, setSearchText] = useState('');
  const LogoLink = (llp: any) => <Link to={links.dashboard} {...llp}/>;
  return (
    <div>
      <AppBarContainer/>
      <main className={classes.main}>
        <div className={classes.toolbar}/>
        <Switch>
          <Route exact path={links.dashboard} render={() => <Dashboard/>}/>
          <Route path={'/manual/:id/edit'} render={props => <EditorFrameContainer {...props}/>}/>
          <Route path={'/manual/:id/request/:requestId'} render={props => <RequestContainer {...props}/>}/>
          <Route path={'/manual/:id'}      render={props => <ViewContainer {...props}/>}/>
          <Redirect to={links.dashboard}/>
        </Switch>
      </main>
    </div>
  );
}

export default withStyles(styles)(PageFrame);
