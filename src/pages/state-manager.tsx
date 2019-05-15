import * as React from 'react';
import { Tree, KTreeNode } from '../data-types/tree-node';
import TreeUtil from '../func/tree';
import keys from '../settings/storage-keys';
import User from '../data-types/user';
import LoginRouter from './login-router';

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
    return <LoginRouter/>;
  }
} 

export default StateManager;