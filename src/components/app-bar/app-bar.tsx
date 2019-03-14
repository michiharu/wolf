import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Select, Slide, Paper } from '@material-ui/core';
import { PopoverOrigin } from '@material-ui/core/Popover'
import { Menu as MenuIcon, AccountCircle, Close, VerticalSplit } from '@material-ui/icons';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from "react-router";
import { drawerWidth, rightPainWidth } from '../../settings/layout';
import User from '../../data-types/user';
import { toolbarHeight, toolbarMinHeight } from '../../settings/layout';
import link from '../../settings/path-list';
import TreeNode from '../../data-types/tree-node';

const styles = (theme: Theme) => createStyles({
  root: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  portalAnchor: {
    position: 'relative',
    overflow: 'visible',
    width: 1,
    height: toolbarHeight,
    [theme.breakpoints.down('xs')]: { height: toolbarMinHeight },
  },
  selectMode: {
    marginTop: 1,
    marginLeft: theme.spacing.unit * 2,
    fontSize: theme.typography.pxToRem(20),
    color: '#fff',
  },
  grow: {
    flexGrow: 1,
  },
  toggleContainer: {
    margin: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    background: theme.palette.background.default,
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  rightPaneAnchor: {
    position: 'relative',
    overflow: 'visible',
    width: 1,
    height: toolbarHeight,
    [theme.breakpoints.down('xs')]: { height: toolbarMinHeight },
  },
  rightPaneWrapper: {
    position: 'absolute',
    overflow: 'visible',
    top: toolbarHeight,
    height: `calc(100vh - ${toolbarHeight}px)`,
    [theme.breakpoints.down('xs')]: {
      top: toolbarMinHeight,
      height: `calc(100vh - ${toolbarMinHeight}px)`
    },
    right: -24,
    width: '25vw',
    minWidth: rightPainWidth,
  },
  rightPanePaper: {
    width: '100%',
    height: '100%',
    borderLeft: 'solid 1px #ccc',
    backgroundColor: theme.palette.background.paper
  }
});

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  user: User | null;
  getToolRef: (el: HTMLDivElement) => void;
  getRightPaneRef: (el: HTMLDivElement) => void;
  handleDrawerToggle: () => void;
  selectedNodeList: TreeNode[] | null;
  logout: () => void;
}

interface State {
  anchorEl: HTMLElement | null;
  toggles: string[];
  setRightPaneRef: boolean;
}

const rightPane = 'rightPane'; 

const CustomAppBar = withStyles(styles)(class extends React.Component<Props, State> {

  toolRef = React.createRef<HTMLDivElement>();
  rightPaneRef = React.createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);
    this.state = { anchorEl: null, toggles: [], setRightPaneRef: false };
  }

  componentDidMount() {
    this.props.getToolRef(this.toolRef.current!);
  }

  handleMenu = (e: any) => {
    this.setState({ anchorEl: e.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleToggles = (_: any, toggles: string[]) => {
    const { getRightPaneRef } = this.props;
    const { setRightPaneRef } = this.state;
    if (!setRightPaneRef) {
      process.nextTick(() => getRightPaneRef(this.rightPaneRef.current!));
    }
    this.setState({toggles, setRightPaneRef: true});    
  }

  handleLogout = () => {
    this.props.logout();
    this.handleClose();
  }

  render() {
    const { user, handleDrawerToggle, selectedNodeList, location, history, classes } = this.props;
    const { anchorEl, toggles } = this.state;
    const open = Boolean(anchorEl);
    const origin: PopoverOrigin = { vertical: 'top', horizontal: 'right' };
    const path = location.pathname;
    return (
      <AppBar position="fixed" className={user !== null ? classes.root : undefined}>
        <Toolbar>
          <div className={classes.portalAnchor}><div ref={this.toolRef}/></div>
          {user !== null && (
          <IconButton
            color="inherit"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>)}
          <Typography variant="h6" color="inherit">
            Flow Like
          </Typography>
          <Select
            className={classes.selectMode}
            value={path}
            onChange={(e: any) => history.push(e.target.value)}
            autoWidth
            disableUnderline
          >
            <MenuItem value={link.edit}>編集モード</MenuItem>
            <MenuItem value={link.view}>Viewモード</MenuItem>
          </Select>

          <div className={classes.grow}/>

          {selectedNodeList !== null && selectedNodeList.length !== 0 && (
          <div className={classes.toggleContainer}>
            <ToggleButtonGroup value={toggles} onChange={this.handleToggles}>
              <ToggleButton value={rightPane}>
                <VerticalSplit />
              </ToggleButton>
            </ToggleButtonGroup>
          </div>)}
          
          {user !== null && (
          <>
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
          </>)}
          <div className={classes.rightPaneAnchor}>
            <div className={classes.rightPaneWrapper}>
              <Slide direction="left" in={toggles.indexOf(rightPane) !== -1} mountOnEnter>
                <div className={classes.rightPanePaper}>
                  <div ref={this.rightPaneRef}/>
                </div>
              </Slide>
            </div>
          </div>
        </Toolbar>
      </AppBar>
    );
  }
});

export default withRouter(CustomAppBar);
