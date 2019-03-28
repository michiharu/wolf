import * as React from 'react';
import { Theme, createStyles, WithStyles, withStyles } from '@material-ui/core';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import User from '../data-types/user';
import { loginURL, nodeURL } from '../data-types/api';
import Layout from './layout';
import axios from '../settings/axios';
import TreeNode from '../data-types/tree-node';
import { node } from 'prop-types';
import TreeUtil from '../func/tree';

const drawerWidth = 240;
const styles = (theme: Theme) => createStyles({
  toolbar: theme.mixins.toolbar
});

interface State {
  treeNodes: TreeNode[];
  selectedNodeList: TreeNode[] | null; // 選択されたNodeを最初の要素の深さを０として保持する
}

class DataManager extends React.Component<{}, State> {

  constructor(props: {}) {
    super(props);
    this.state = {
      treeNodes: [],
      selectedNodeList: null,
    };
  }

  selectNode = (node: TreeNode | null) => {
    if (node === null) { return this.setState({selectedNodeList: []}); }
    const selectedNodeList = TreeUtil.getGenealogy(this.state.treeNodes!, node);
    this.setState({selectedNodeList});
  }

  changeNode = (target: TreeNode) => {
    const {treeNodes: nodeList, selectedNodeList} = this.state;
    const newNodeList = TreeUtil.replace(nodeList!, target);
    this.setState({treeNodes: newNodeList});
    const selectedNode = selectedNodeList![selectedNodeList!.length - 1];
    const newSelectedNode = TreeUtil.find(newNodeList, selectedNode)!;
    process.nextTick(() => this.selectNode(newSelectedNode));
  }

  addNode = (node: TreeNode) => {
    const { treeNodes } = this.state;
    treeNodes!.unshift(node);
    this.setState({treeNodes}); 
  }

  render () {
    const { treeNodes, selectedNodeList } = this.state;

    return (
      <Layout
        treeNodes={treeNodes}
        selectedNodeList={selectedNodeList}
        selectNode={this.selectNode}
        changeNode={this.changeNode}
        addNode={this.addNode}
      />
    );
  }
} 

export default withStyles(styles)(DataManager);