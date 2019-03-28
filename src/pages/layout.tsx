import * as React from 'react';
import { Theme, createStyles, WithStyles, withStyles } from '@material-ui/core';
import { BrowserRouter, Route } from 'react-router-dom';
import AppBar from '../components/app-bar/app-bar';
import Drawer, { DrawerProps } from '../components/drawer/drawer';
import TreeNode from '../data-types/tree-node';
import PageRouter from './page-router';
import link from '../settings/path-list';

const styles = (theme: Theme) => createStyles({
  root: { display: 'flex' },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
  },
});

interface Props extends WithStyles<typeof styles> {
  treeNodes: TreeNode[];
  selectedNodeList: TreeNode[] | null;

  selectNode: (node: TreeNode | null) => void;
  changeNode: (node: TreeNode) => void;
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
      treeNodes, selectedNodeList, selectNode, changeNode, addNode, classes
    } = this.props;
    const { open, toolRef, rightPaneRef } = this.state;
    const drawerNullCheckerProps: DrawerProps = {
      open, toggle: this.toggle, treeNodes, selectedNodeList, selectNode, changeNode
    };

    return (
      <BrowserRouter>
        <Route render={props => (
          <div className={classes.root}>

            <AppBar
              {...props}
              getToolRef={this.getToolRef}
              getRightPaneRef={this.getRightPaneRef}
              handleDrawerToggle={this.toggle}
              selectedNodeList={selectedNodeList}
            />
            {props.location.pathname !== link.dashboard && <Drawer {...drawerNullCheckerProps} />}
            

            <main className={classes.content}>
              <div className={classes.toolbar}/>
              <PageRouter
                toolRef={toolRef}
                rightPaneRef={rightPaneRef}
                treeNodes={treeNodes}
                selectedNodeList={selectedNodeList}
                changeNode={changeNode}
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