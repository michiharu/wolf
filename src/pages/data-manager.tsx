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

    const commonNodesFromStorage = localStorage.getItem(keys.commonList);
    const commonNodes = commonNodesFromStorage !== null ? JSON.parse(commonNodesFromStorage) : [];

    this.state = {
      treeNodes,
      selectedNodeList: [],
      commonNodes,
    };
  }

  selectNode = (node: TreeNode | null) => {
    if (node === null) { return this.setState({selectedNodeList: []}); }
    const selectedNodeList = TreeUtil.getGenealogy(this.state.treeNodes!, node);
    this.setState({selectedNodeList});
  }

  changeNode = (target: TreeNode) => {
    const {treeNodes: nodeList, selectedNodeList} = this.state;
    const treeNodes = TreeUtil.replaceChild(nodeList!, target);
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

  deleteNode = (target: TreeNode) => {
    const { treeNodes, commonNodes } = this.state;
    const newTreeNodes = treeNodes.filter(n => n.id !== target.id);
    this.setState({treeNodes: newTreeNodes}); 
    localStorage.setItem(keys.tree, JSON.stringify(newTreeNodes));
    if (commonNodes.indexOf(target) !== -1) { this.deleteCommonList(target); }
  }

  addCommonList = (node: TreeNode) => {
    const { commonNodes } = this.state;
    commonNodes.push(node);
    this.setState({commonNodes});
    localStorage.setItem(keys.commonList, JSON.stringify(commonNodes));
  }
  deleteCommonList = (node: TreeNode) => {
    const { commonNodes } = this.state;
    const index = commonNodes.indexOf(node);
    commonNodes.splice(index, 1);
    this.setState({commonNodes});
    localStorage.setItem(keys.commonList, JSON.stringify(commonNodes));
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
        deleteNode={this.deleteNode}
        addCommonList={this.addCommonList}
        deleteCommonList={this.deleteCommonList}
      />
    );
  }
} 

export default DataManager;