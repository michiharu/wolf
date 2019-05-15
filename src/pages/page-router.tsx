import * as React from 'react';
import {useState} from 'react';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import { Tree, KTreeNode } from '../data-types/tree-node';
import links from '../settings/links';
import EditorStateManager from './manual/edit/editor-state-manager';
import Dashboard from './dashboard/dashboard-component';
import { Theme, createStyles, WithStyles, AppBar, Toolbar, Button, Tabs, Tab, InputBase, withStyles } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Manual from './manual/manual';

const styles = (theme: Theme) => createStyles({
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

const PageRouter: React.FC<Props> = (props) => {
  const { classes } = props;

  const [searchText, setSearchText] = useState('');
  const LogoLink = (llp: any) => <Link to={links.dashboard} {...llp}/>;
  return (
    <div>
      <AppBar>
        <Toolbar>
          <Button component={LogoLink} color="inherit" size="large">Flow Like</Button>

          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <Search />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              onChange={e => setSearchText(e.target.value)}
            />
          </div>
          <Button color="inherit">フォロー</Button>
          <Button color="inherit">お気に入り</Button>
          <Button color="inherit">Item Three</Button>
          <div style={{flexGrow: 1}} />
        </Toolbar>
      </AppBar>
      <main className={classes.main}>
        <div className={classes.toolbar}/>
        <Switch>
          <Route exact path={links.dashboard} render={() => <Dashboard/>}/>
          <Route
            path={'/manual/:id'}
            render={routerProps => <p>まにゅある</p>// <Manual {...routerProps} {...props}/>
          }
          />
          <Redirect to={links.dashboard}/>
        </Switch>
      </main>
    </div>
  );
}

export default withStyles(styles)(PageRouter);
