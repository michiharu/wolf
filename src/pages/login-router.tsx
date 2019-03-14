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
  containerRef: HTMLDivElement | null;
  treeNodes: TreeNode[] | null;
  selectedNodeList: TreeNode[] | null;
  focusNode: TreeNode | null;
  changeNode: (node: TreeNode) => void;
  loadNode: () => void;
  selectNode: (node: TreeNode | null) => void;
}

const LoginRouter: React.SFC<Props> = (props: Props) => {
  const {
    user, login, containerRef, treeNodes, selectedNodeList, focusNode, changeNode, loadNode, selectNode
  } = props;
  return (
    <Switch>
      {(user === null) && <Route render={() => <Login login={login}/>}/>}
      <Route render={() => (
        <PageRouter
          containerRef={containerRef}
          treeNodes={treeNodes}
          selectedNodeList={selectedNodeList}
          focusNode={focusNode}
          changeNode={changeNode}
          loadNode={loadNode}
          selectNode={selectNode}
        />
      )}/>
    </Switch>
  );
}
export default LoginRouter;