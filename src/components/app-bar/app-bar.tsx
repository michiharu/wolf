import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';
import { PopoverOrigin } from '@material-ui/core/Popover'
import { Menu as MenuIcon, AccountCircle, Close } from '@material-ui/icons';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from "react-router";
import { Link } from 'react-router-dom';
import { drawerWidth } from '../../pages/layout';
import User from '../../data-types/user';

const styles = (theme: Theme) => createStyles({
  root: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  grow: {
    flexGrow: 1,
  },

  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },

});

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  user: User | null;
  handleDrawerToggle: () => void;
  logout: () => void;
}

interface State {
  anchorEl: HTMLElement | null;
}

const CustomAppBar = withStyles(styles)(class extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      anchorEl: null,
    };
  }

  handleMenu = (e: any) => {
    this.setState({ anchorEl: e.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  linkToUnsentList = () => {
    this.props.history.push('/unsent-list');
    this.handleClose();
  };

  handleLogout = () => {
    this.props.logout();
    this.handleClose();
  }

  render() {
    const { user, handleDrawerToggle, classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    const origin: PopoverOrigin = { vertical: 'top', horizontal: 'right' };

    return (
      <AppBar position="fixed" className={user !== null ? classes.root : undefined}>
        <Toolbar>
          {user !== null && (
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" color="inherit">
            Flow Like
          </Typography>
          <div className={classes.grow}/>
          
          {user !== null && (
            <div>
              <IconButton
                aria-owns={open ? 'menu-appbar' : undefined}
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={origin}
                transformOrigin={origin}
                open={open}
                onClose={this.handleClose}
                disableAutoFocusItem
              >
                <MenuItem onClick={this.handleLogout}>
                  <ListItemIcon>
                    <Close />
                  </ListItemIcon>
                  <ListItemText primary="ログアウト" />
                </MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    );
  }
});

export default withRouter(CustomAppBar);
