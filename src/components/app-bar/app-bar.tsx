import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Select } from '@material-ui/core';
import { PopoverOrigin } from '@material-ui/core/Popover'
import { Menu as MenuIcon, AccountCircle, Close } from '@material-ui/icons';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from "react-router";
import { drawerWidth } from '../../settings/layout';
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
  rootNoDrawer: {

  },
  toolbar: {
    margin: 'auto',
    width: theme.breakpoints.width('lg'),

    [theme.breakpoints.down('md')]: {
      width: '100%',
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
});

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  getToolRef: (el: HTMLDivElement) => void;
  getRightPaneRef: (el: HTMLDivElement) => void;
  handleDrawerToggle: () => void;
  selectedNodeList: TreeNode[] | null;
}

interface State {
  anchorEl: HTMLElement | null;
}

// const rightPane = 'rightPane';

const CustomAppBar = withStyles(styles)(class extends React.Component<Props, State> {

  toolRef = React.createRef<HTMLDivElement>();
  rightPaneRef = React.createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);
    this.state = { anchorEl: null };
  }

  componentDidMount() {
    this.props.getToolRef(this.toolRef.current!);
    this.props.getRightPaneRef(this.rightPaneRef.current!);
  }

  handleMenu = (e: any) => {
    this.setState({ anchorEl: e.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { handleDrawerToggle, selectedNodeList, location, classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    const origin: PopoverOrigin = { vertical: 'top', horizontal: 'right' };
    const path = location.pathname;
    return (
      <AppBar position="fixed" className={path !== link.dashboard ? classes.root : classes.rootNoDrawer}>
        <Toolbar className={classes.toolbar}>
          <div className={classes.portalAnchor}><div ref={this.toolRef}/></div>

          {path !== link.dashboard && (
          <IconButton color="inherit" onClick={handleDrawerToggle} className={classes.menuButton}>
            <MenuIcon />
          </IconButton>)}
          

          <Typography variant="h6" color="inherit">Flow Like</Typography>

          <div className={classes.grow}/>

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
              <MenuItem>
                <ListItemIcon>
                  <Close />
                </ListItemIcon>
                <ListItemText primary="スタブ" />
              </MenuItem>
            </Menu>
          </>
          <div className={classes.rightPaneAnchor}>
            <div ref={this.rightPaneRef}/>
          </div>
        </Toolbar>
      </AppBar>
    );
  }
});

export default CustomAppBar;
