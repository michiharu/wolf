import * as React from 'react';
import { Theme, createStyles, WithStyles, withStyles } from '@material-ui/core';
import { BrowserRouter, Route } from 'react-router-dom';
import AppBar from '../components/app-bar/app-bar';
import TreeNode from '../data-types/tree-node';
import PageRouter from './page-router';

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
  commonNodes: TreeNode[];

  selectNode: (node: TreeNode | null) => void;
  changeNode: (node: TreeNode) => void;
  addNode: (node: TreeNode) => void;
  addCommonList: (node: TreeNode) => void;
  deleteCommonList: (node: TreeNode) => void;
}

interface State {
  toolRef: HTMLDivElement | null;
  rightPaneRef: HTMLDivElement | null;
}

class Layout extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {toolRef: null, rightPaneRef: null};
  }

  getToolRef = (el: HTMLDivElement) => this.setState({toolRef: el});

  getRightPaneRef = (el: HTMLDivElement) => this.setState({rightPaneRef: el});

  
  render() {
    const {
      treeNodes, selectedNodeList, commonNodes,
      selectNode, changeNode, addNode, addCommonList, deleteCommonList, classes
    } = this.props;
    const { toolRef, rightPaneRef } = this.state;

    return (
      <BrowserRouter>
        <Route render={props => (
          <div className={classes.root}>

            <AppBar
              {...props}
              getToolRef={this.getToolRef}
              getRightPaneRef={this.getRightPaneRef}
            />

            <main className={classes.content}>
              <div className={classes.toolbar}/>
              <PageRouter
                toolRef={toolRef}
                rightPaneRef={rightPaneRef}
                treeNodes={treeNodes}
                selectedNodeList={selectedNodeList}
                commonNodes={commonNodes}
                selectNode={selectNode}
                changeNode={changeNode}
                addNode={addNode}
                addCommonList={addCommonList}
                deleteCommonList={deleteCommonList}
              />
            </main>
            
          </div>
        )}/>
      </BrowserRouter>
    );
  }
}

export default withStyles(styles)(Layout);