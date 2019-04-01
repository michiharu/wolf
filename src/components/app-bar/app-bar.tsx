import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';
import { PopoverOrigin } from '@material-ui/core/Popover'
import { AccountCircle, Close } from '@material-ui/icons';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { RouteComponentProps } from "react-router";
import { toolbarHeight, toolbarMinHeight } from '../../settings/layout';
import link from '../../settings/path-list';
import TreeNode from '../../data-types/tree-node';

const styles = (theme: Theme) => createStyles({
  root: {

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
}

interface State {
  anchorEl: HTMLElement | null;
}

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
    const {location, classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    const origin: PopoverOrigin = { vertical: 'top', horizontal: 'right' };
    const path = location.pathname;
    return (
      <AppBar className={classes.root}>
        <Toolbar variant="dense" className={path === link.dashboard ? classes.toolbar : undefined}>
          <div className={classes.portalAnchor}><div ref={this.toolRef}/></div>

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
