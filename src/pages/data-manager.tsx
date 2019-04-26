import * as React from 'react';
import { Tree, KTreeNode, baseKTreeNode } from '../data-types/tree-node';
import TreeUtil from '../func/tree';
import keys from '../settings/storage-keys';
import PageRouter from './page-router';
import { ks } from '../settings/layout';

interface State {
  treeNodes: Tree[];
  selectedNodeList: Tree[]; // 選択されたNodeを最初の要素の深さを０として保持する
  commonNodes: Tree[];
  memoList: KTreeNode[];
}

class DataManager extends React.Component<{}, State> {

  constructor(props: {}) {
    super(props);

    const treeNodesFromStorage = localStorage.getItem(keys.tree);
    const treeNodes = treeNodesFromStorage !== null ? JSON.parse(treeNodesFromStorage) : [];

    const commonNodesFromStorage = localStorage.getItem(keys.commonList);
    const commonNodes = commonNodesFromStorage !== null ? JSON.parse(commonNodesFromStorage) : [];

    const memoListFromStorage = localStorage.getItem(keys.memoList);
    const memoList = memoListFromStorage !== null ? JSON.parse(memoListFromStorage) : [];
    
    const testMemo: KTreeNode = {
      ...baseKTreeNode,
      label: 'test',
      isMemo: true,
      point: {x: 5, y: 10},
      rect: ks.rect,
    };
    memoList.push(testMemo);

    this.state = {
      treeNodes,
      selectedNodeList: [],
      commonNodes,
      memoList,
    };
  }

  selectNode = (node: Tree | null) => {
    if (node === null) { return this.setState({selectedNodeList: []}); }
    const selectedNodeList = TreeUtil.getGenealogy(this.state.treeNodes!, node);
    this.setState({selectedNodeList});
  }

  changeNode = (target: Tree) => {
    const {treeNodes: nodeList, selectedNodeList} = this.state;
    const treeNodes = TreeUtil._replaceArray(nodeList!, target);
    this.setState({treeNodes});
    localStorage.setItem(keys.tree, JSON.stringify(treeNodes));

    const selectedNode = selectedNodeList![selectedNodeList!.length - 1];
    const newSelectedNode = TreeUtil._findArray(treeNodes, selectedNode)!;
    process.nextTick(() => this.selectNode(newSelectedNode));
  }

  addNode = (node: Tree) => {
    const { treeNodes } = this.state;
    treeNodes!.unshift(node);
    this.setState({treeNodes}); 
    localStorage.setItem(keys.tree, JSON.stringify(treeNodes));
  }

  deleteNode = (target: Tree) => {
    const { treeNodes, commonNodes } = this.state;
    const newTreeNodes = treeNodes.filter(n => n.id !== target.id);
    this.setState({treeNodes: newTreeNodes}); 
    localStorage.setItem(keys.tree, JSON.stringify(newTreeNodes));
    if (commonNodes.indexOf(target) !== -1) { this.deleteCommonList(target); }
  }

  addCommonList = (node: Tree) => {
    const { commonNodes } = this.state;
    commonNodes.push(node);
    this.setState({commonNodes});
    localStorage.setItem(keys.commonList, JSON.stringify(commonNodes));
  }
  deleteCommonList = (node: Tree) => {
    const { commonNodes } = this.state;
    const index = commonNodes.indexOf(node);
    commonNodes.splice(index, 1);
    this.setState({commonNodes});
    localStorage.setItem(keys.commonList, JSON.stringify(commonNodes));
  }

  addMemo = (memo: KTreeNode) => {
    const { memoList } = this.state;
    memoList.push(memo);
    this.setState({memoList});
  }

  deleteMemo = (memo: KTreeNode) => {
    const { memoList } = this.state;
    this.setState({memoList: memoList.filter(m => m.id !== memo.id)});
  }

  render () {
    const { treeNodes, selectedNodeList, commonNodes, memoList } = this.state;

    return (
      <PageRouter
        treeNodes={treeNodes}
        selectedNodeList={selectedNodeList}
        commonNodes={commonNodes}
        memoList={memoList}
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