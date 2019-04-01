import * as React from 'react';
import Layout from './layout';
import TreeNode from '../data-types/tree-node';
import TreeUtil from '../func/tree';

interface State {
  treeNodes: TreeNode[];
  selectedNodeList: TreeNode[] | null; // 選択されたNodeを最初の要素の深さを０として保持する
  commonNodes: TreeNode[];
}

class DataManager extends React.Component<{}, State> {

  constructor(props: {}) {
    super(props);
    this.state = {
      treeNodes: [],
      selectedNodeList: null,
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