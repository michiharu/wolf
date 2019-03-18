import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './login/login';
import User from '../data-types/user';
import PageRouter from './auth/page-router';
import TreeNode from '../data-types/tree-node';
import nodeList from './auth/node-viewer/node-list';

interface Props {
  user: User | null;
  login: (user: User) => void;
  toolRef: HTMLDivElement | null;
  rightPaneRef: HTMLDivElement | null;
  treeNodes: TreeNode[] | null;
  selectedNodeList: TreeNode[] | null;
  changeNode: (node: TreeNode) => void;
  loadNode: () => void;
  addNode: (node: TreeNode) => void;
  selectNode: (node: TreeNode | null) => void;
}

const LoginRouter: React.SFC<Props> = (props: Props) => {
  const {
    user, login, toolRef, rightPaneRef, treeNodes, selectedNodeList, changeNode, loadNode, addNode, selectNode
  } = props;
  return (
    <Switch>
      {(user === null) && <Route render={() => <Login login={login}/>}/>}
      <Route render={() => (
        <PageRouter
          toolRef={toolRef}
          rightPaneRef={rightPaneRef}
          treeNodes={treeNodes}
          selectedNodeList={selectedNodeList}
          changeNode={changeNode}
          loadNode={loadNode}
          addNode={addNode}
          selectNode={selectNode}
        />
      )}/>
    </Switch>
  );
}
export default LoginRouter;