import * as React from 'react';
import {useState} from 'react';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import { Theme, createStyles, WithStyles, AppBar as MUIAppBar, Toolbar, Button, Tabs, Tab, InputBase, withStyles, IconButton, Badge, Typography } from '@material-ui/core';
import { Search, Notifications } from '@material-ui/icons';
import { fade } from '@material-ui/core/styles/colorManipulator';
import User from '../../../data-types/user';
import links from '../../../settings/links';

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
});

interface Props extends WithStyles<typeof styles> {
  user: User;
}

const AppBarComponent: React.FC<Props> = (props) => {
  const { user, classes } = props;
  const [searchText, setSearchText] = useState('');
  const LogoLink = (llp: any) => <Link to={links.dashboard} {...llp}/>;
  const FollowsLink = (llp: any) => <Link to={links.follows} {...llp}/>;
  return (
    <MUIAppBar>
      <Toolbar>
        <Button component={LogoLink} color="inherit" size="large">Flow Like</Button>

        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <Search />
          </div>
          <InputBase
            placeholder="Search…"
            value={searchText}
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            onChange={e => setSearchText(e.target.value)}
          />
        </div>
        <Button component={FollowsLink} color="inherit">フォロー</Button>
        <Button color="inherit">お気に入り</Button>
        {user.isOperationManager && <Button color="inherit">レビューリスト</Button>}
        
        <div style={{flexGrow: 1}} />
        <div style={{display: 'flex'}}>
          <Typography color="inherit">{`${user.lastName} ${user.firstName}`}</Typography>
        </div>
      </Toolbar>
    </MUIAppBar>
  );
}

export default withStyles(styles)(AppBarComponent);
