import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { LoginUserState } from '../../redux/states/main/loginUserState';
import PageRouter from '../page-router';
import { Search } from '@material-ui/icons';
import { InputBase, Button } from '@material-ui/core';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import links from '../../settings/links';
import AdapterLink from '../../components/custom-mui/adapter-link';
import DrawerContentContainer from './drawer-content/drawer-content-container';

export const drawerWidth = 300;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    borderBottom: `1px solid rgb(0,0,0,0.12)`,
  },
  logoContainer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth - theme.spacing(3),
      flexShrink: 0,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
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
    [theme.breakpoints.up('md')]: {
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
    paddingTop: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
    paddingLeft: theme.spacing(10),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 240,
    },
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

interface Props extends LoginUserState, RouteComponentProps<{}> {}

function AppFrameComponent({user, location}: Props) {

  const classes = useStyles();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }

  const [searchText, setSearchText] = React.useState('');
  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value);
  }

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
          <Button component={AdapterLink} to={links.dashboard}>
            <Typography variant="h6" noWrap>Flow Like</Typography>
          </Button>
          
          {location.pathname !== links.dashboard &&
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
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        <Hidden mdUp implementation="css">
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
        <Hidden smDown implementation="css">
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