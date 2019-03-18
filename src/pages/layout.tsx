import * as React from 'react';
import { Theme, createStyles, WithStyles, withStyles } from '@material-ui/core';
import { BrowserRouter, Route } from 'react-router-dom';
import Login from './login/login';
import User from '../data-types/user';
import AppBar from '../components/app-bar/app-bar';
import DrawerNullChecker, { DrawerNullCheckerProps } from '../components/drawer/drawer-null-checker';
import LoginRouter from './login-router';
import TreeNode from '../data-types/tree-node';

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

  treeNodes: TreeNode[] | null;
  selectedNodeList: TreeNode[] | null;

  selectNode: (node: TreeNode | null) => void;
  changeNode: (node: TreeNode) => void;
  loadNode: () => void;
  addNode: (node: TreeNode) => void;
}

interface State {
  open: boolean;
  toolRef: HTMLDivElement | null;
  rightPaneRef: HTMLDivElement | null;
}

class Layout extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {open: false, toolRef: null, rightPaneRef: null};
  }

  toggle = () => this.setState(state => ({ open: !state.open }));

  getToolRef = (el: HTMLDivElement) => this.setState({toolRef: el});

  getRightPaneRef = (el: HTMLDivElement) => this.setState({rightPaneRef: el});

  
  render() {
    const {
      user, login, logout, treeNodes, selectedNodeList, selectNode, changeNode, loadNode, addNode, classes
    } = this.props;
    const { open, toolRef, rightPaneRef } = this.state;
    const drawerNullCheckerProps: DrawerNullCheckerProps = {
      open, toggle: this.toggle, treeNodes, selectedNodeList, selectNode, changeNode
    };

    return (
      <BrowserRouter>
        <Route render={() => (
          <div className={classes.root}>
            <AppBar
              user={user} 
              getToolRef={this.getToolRef}
              getRightPaneRef={this.getRightPaneRef}
              handleDrawerToggle={this.toggle}
              selectedNodeList={selectedNodeList}
              logout={logout}
            />
            {user !== null && (
            <DrawerNullChecker {...drawerNullCheckerProps} />)}

            <main className={classes.content}>
              <div className={classes.toolbar}/>
              <LoginRouter
                user={user}
                login={login}
                toolRef={toolRef}
                rightPaneRef={rightPaneRef}
                treeNodes={treeNodes}
                selectedNodeList={selectedNodeList}
                changeNode={changeNode}
                loadNode={loadNode}
                addNode={addNode}
                selectNode={selectNode}
              />
            </main>
            
          </div>
        )}/>
      </BrowserRouter>
    );
  }
}

export default withStyles(styles)(Layout);