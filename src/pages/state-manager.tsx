import * as React from 'react';
import { Tree, KTreeNode } from '../data-types/tree-node';
import TreeUtil from '../func/tree';
import keys from '../settings/storage-keys';
import User from '../data-types/user';
import LoginRouter, { LoginRouterProps } from './login-router';

export interface RootState {
  user: User | null;
  manuals: Tree[];
  commons: Tree[];
  memos: KTreeNode[];
}

class StateManager extends React.Component<{}, RootState> {

  constructor(props: {}) {
    super(props);

    this.state = {
      user: null,
      manuals: [],
      commons: [],
      memos: [],
    };
  }

  login = (rootState: RootState) => this.setState(rootState);

  logout = () => this.setState({user: null});

  changeManuals = (manuals: Tree[]) => this.setState({manuals});


  // addNode = (node: Tree) => {
  //   const { manuals: treeNodes } = this.state;
  //   treeNodes!.unshift(node);
  //   this.setState({manuals: treeNodes}); 
  // }

  // deleteNode = (target: Tree) => {
  //   const { manuals: treeNodes, commons: commonNodes } = this.state;
  //   const newTreeNodes = treeNodes.filter(n => n.id !== target.id);
  //   this.setState({manuals: newTreeNodes}); 
  //   if (commonNodes.indexOf(target) !== -1) { this.deleteCommonList(target); }
  // }

  addCommonList = (node: Tree) => {
    const { commons: commonNodes } = this.state;
    commonNodes.push(node);
    this.setState({commons: commonNodes});
    localStorage.setItem(keys.commonList, JSON.stringify(commonNodes));
  }
  deleteCommonList = (node: Tree) => {
    const { commons: commonNodes } = this.state;
    const index = commonNodes.indexOf(node);
    commonNodes.splice(index, 1);
    this.setState({commons: commonNodes});
    localStorage.setItem(keys.commonList, JSON.stringify(commonNodes));
  }

  changeMemo = (memoList: KTreeNode[]) => {
    this.setState({memos: memoList});
  }

  render () {
    const { user, manuals, commons, memos } = this.state;
    const loginRouterProps: LoginRouterProps = {
      user, login: this.login,
      manuals, changeManuals: this.changeManuals, 
      commons, addCommonList: this.addCommonList, deleteCommonList: this.deleteCommonList,
      memos, changeMemo: this.changeMemo
    }
    return <LoginRouter {...loginRouterProps}/>;
  }
} 

export default StateManager;