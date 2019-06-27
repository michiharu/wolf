import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import PageRouter from '../page-router';
import { Search, AccountCircle } from '@material-ui/icons';
import { InputBase, Button, Menu, MenuItem, Dialog } from '@material-ui/core';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import links from '../../settings/links';
import AdapterLink from '../../components/custom-mui/adapter-link';
import DrawerContentContainer from './drawer-content/drawer-content-container';
import { LayoutActions } from './layout-container';
import User from '../../data-types/user';
import ProfileContainer from './profile/profile-container';

export const drawerWidth = 300;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('lg')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    borderBottom: `1px solid rgb(0,0,0,0.12)`,
  },
  logoContainer: {
    [theme.breakpoints.up('lg')]: {
      width: drawerWidth - theme.spacing(3),
      flexShrink: 0,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.default,
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(3),
    width: 'auto',
    [theme.breakpoints.up('lg')]: {
      width: 'auto',
      marginLeft: theme.spacing(24),
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
    paddingTop: theme.spacing(0.8),
    paddingRight: theme.spacing(0.8),
    paddingBottom: theme.spacing(0.8),
    paddingLeft: theme.spacing(10),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('lg')]: {
      width: 240,
    },
  },
  grow: {
    flexGrow: 1,
  },
  accountCircle: {
    marginRight: theme.spacing(1)
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(0),
  },
}));

interface Props extends LayoutActions, RouteComponentProps {
  user: User;
}

function AppFrameComponent({user, logout, location}: Props) {

  const classes = useStyles();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }

  const [searchText, setSearchText] = React.useState('');
  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value);
  }

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  function handleProfileMenuOpen(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  const [showProfile, setShowProfile] = React.useState(false);

  function handleShowProfile() {
    setAnchorEl(null);
    setShowProfile(true);
  }

  function handleHideProfile() {
    setShowProfile(false);
  }

  function handleLogout() {
    setAnchorEl(null);
    logout();
  }

  const menuId = 'account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleShowProfile}>プロフィール</MenuItem>
      <MenuItem onClick={handleLogout}>ログアウト</MenuItem>
    </Menu>
  );

  const renderProfile = (
    <Dialog open={showProfile} onClose={handleHideProfile} maxWidth="sm" fullWidth>
      <ProfileContainer onClose={handleHideProfile}/>
    </Dialog>
  );

  return (
    <div className={classes.root}>
      <AppBar position="fixed" color="inherit" elevation={0} className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Button component={AdapterLink} to={links.dashboard} size="small">
            <Typography variant="h6" noWrap>Flow Like</Typography>
          </Button>
          
          {false && location.pathname !== links.dashboard &&
          <div className={classes.search}>
            <div className={classes.searchIcon}><Search /></div>
            <InputBase
              placeholder="マニュアル検索"
              value={searchText}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              onChange={handleSearch}
            />
          </div>}
          <div className={classes.grow} />
          <Button
            aria-label="Account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircle className={classes.accountCircle}/>
            {`${user.lastName} ${user.firstName}`}
          </Button>
          {renderMenu}
          {renderProfile}

        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        <Hidden lgUp implementation="css">
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{ paper: classes.drawerPaper }}
            ModalProps={{ keepMounted: true }}
          >
            <DrawerContentContainer/>
          </Drawer>
        </Hidden>
        <Hidden mdDown implementation="css">
          <Drawer classes={{ paper: classes.drawerPaper }} variant="permanent" open>
            <DrawerContentContainer/>
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <PageRouter/>
      </main>
    </div>
  );
}

export default withRouter(AppFrameComponent);