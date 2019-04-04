import * as React from 'react';
import Layout from './layout';
import TreeNode from '../data-types/tree-node';
import TreeUtil from '../func/tree';
import keys from '../settings/storage-keys';

interface State {
  treeNodes: TreeNode[];
  selectedNodeList: TreeNode[]; // 選択されたNodeを最初の要素の深さを０として保持する
  commonNodes: TreeNode[];
}

class DataManager extends React.Component<{}, State> {

  constructor(props: {}) {
    super(props);
    const treeNodesFromStorage = localStorage.getItem(keys.tree);
    const treeNodes = treeNodesFromStorage !== null ? JSON.parse(treeNodesFromStorage) : [];
    this.state = {
      treeNodes,
      selectedNodeList: [],
      commonNodes: [],
    };
  }

  selectNode = (node: TreeNode | null) => {
    if (node === null) { return this.setState({selectedNodeList: []}); }
    const selectedNodeList = TreeUtil.getGenealogy(this.state.treeNodes!, node);
    this.setState({selectedNodeList});
  }

  changeNode = (target: TreeNode) => {
    const {treeNodes: nodeList, selectedNodeList} = this.state;
    const treeNodes = TreeUtil.replace(nodeList!, target);
    this.setState({treeNodes});
    localStorage.setItem(keys.tree, JSON.stringify(treeNodes));

    const selectedNode = selectedNodeList![selectedNodeList!.length - 1];
    const newSelectedNode = TreeUtil.find(treeNodes, selectedNode)!;
    process.nextTick(() => this.selectNode(newSelectedNode));
  }

  addNode = (node: TreeNode) => {
    const { treeNodes } = this.state;
    treeNodes!.unshift(node);
    this.setState({treeNodes}); 
    localStorage.setItem(keys.tree, JSON.stringify(treeNodes));
  }

  addCommonList = (node: TreeNode) => {
    const { commonNodes } = this.state;
    commonNodes.push(node);
    this.setState({commonNodes}); 
  }
  deleteCommonList = (node: TreeNode) => {
    const { commonNodes } = this.state;
    const index = commonNodes.indexOf(node);
    commonNodes.splice(index, 1);
    this.setState({commonNodes});
  }

  render () {
    const { treeNodes, selectedNodeList, commonNodes } = this.state;

    return (
      <Layout
        treeNodes={treeNodes}
        selectedNodeList={selectedNodeList}
        commonNodes={commonNodes}
        selectNode={this.selectNode}
        changeNode={this.changeNode}
        addNode={this.addNode}
        addCommonList={this.addCommonList}
        deleteCommonList={this.deleteCommonList}
      />
    );
  }
} 

export default DataManager;