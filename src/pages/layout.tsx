import * as React from 'react';
import { Theme, createStyles, WithStyles, withStyles } from '@material-ui/core';
import { BrowserRouter, Route } from 'react-router-dom';
import Login from './login/login';
import User from '../data-types/user';
import AppBar from '../components/app-bar/app-bar';
import DrawerNullChecker, { DrawerNullCheckerProps } from '../components/drawer/drawer-null-checker';
import LoginRouter from './login-router';
import TreeNode from '../data-types/tree-node';

export const drawerWidth = 240;
const styles = (theme: Theme) => createStyles({
  root: { display: 'flex' },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
  },
});

interface Props extends WithStyles<typeof styles> {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;

  nodeList: TreeNode[] | null;
  selectedNodeList: TreeNode[] | null;
  selectNode: (node: TreeNode) => void;
  changeNode: (node: TreeNode) => void;
  loadNode: () => void;
}

interface State {
  open: boolean;
}

class Layout extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {open: false};
  }

  toggle = () => this.setState(state => ({ open: !state.open }));
  
  render() {
    const { user, login, logout, nodeList, selectedNodeList, selectNode, changeNode, loadNode, classes } = this.props;
    const { open } = this.state;
    const drawerNullCheckerProps: DrawerNullCheckerProps = {
      open, toggle: this.toggle, nodeList: nodeList, selectedNodeList, selectNode, changeNode
    };

    return (
      <BrowserRouter>
        <Route render={() => (
          <div className={classes.root}>
            <AppBar user={user} handleDrawerToggle={this.toggle} logout={logout}/>
            {user !== null && (
            <DrawerNullChecker {...drawerNullCheckerProps} />)}

            <main className={classes.content}>
              <div className={classes.toolbar}/>
              <LoginRouter
                user={user}
                login={login}
                selectedNodeList={selectedNodeList}
                changeNode={changeNode}
                loadNode={loadNode}
              />
            </main>
            
          </div>
        )}/>
      </BrowserRouter>
    );
  }
}

export default withStyles(styles)(Layout);