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
  user: User | null;
  treeNodes: TreeNode[] | null;
  selectedNodeList: TreeNode[] | null; // 選択されたNodeを最初の要素の深さを０として保持する
}

class Authentication extends React.Component<{}, State> {

  constructor(props: {}) {
    super(props);
    this.state = {
      user: null,
      treeNodes: null,
      selectedNodeList: null,
    };
  }

  componentDidMount() {
    axios.post(loginURL, {id: 'test-id', password: 'test-password'})
    .then(res => {
      const user = {...res.data.user};
      this.setState({user});
    });  
  }

  login = (user: User) => {
    this.setState({user});
  }

  logout = () => {
    this.setState({user: null});
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

  loadNode = () => axios.get(nodeURL).then(res => this.setState({treeNodes: res.data, selectedNodeList: []}));

  render () {
    const { user, selectedNodeList, treeNodes: nodeList } = this.state;

    return (
      <Layout
        user={user}
        login={this.login}
        logout={this.logout}
        treeNodes={nodeList}
        selectedNodeList={selectedNodeList}
        selectNode={this.selectNode}
        changeNode={this.changeNode}
        loadNode={this.loadNode}
      />
    );
  }
} 

export default withStyles(styles)(Authentication);