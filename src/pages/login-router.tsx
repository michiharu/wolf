import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './login/login';
import User from '../data-types/user';
import PageRouter from './auth/page-router';
import TreeNode from '../data-types/tree-node';

interface Props {
  user: User | null;
  login: (user: User) => void;

  selectedNodeList: TreeNode[] | null;
  changeNode: (node: TreeNode) => void;
  loadNode: () => void;
}

const LoginRouter: React.SFC<Props> = (props: Props) => {
  const {user, login, selectedNodeList, changeNode, loadNode} = props;
  return (
    <Switch>
      {(user === null) && <Route render={() => <Login login={login}/>}/>}
      <Route render={() => (
        <PageRouter user={user!} selectedNodeList={selectedNodeList} changeNode={changeNode} loadNode={loadNode}/>
      )}/>
    </Switch>
  );
}
export default LoginRouter;