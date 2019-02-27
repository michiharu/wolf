import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import User from '../../data-types/user';
import { nodeURL } from '../../data-types/api';
import axios from '../../settings/axios';
import TreeNode from '../../data-types/tree-node';
import link from '../../settings/path-list';
import NodeNullChecker from './node-editor/node-null-checker';

interface Props {
  user: User;
  selectedNodeList: TreeNode[] | null;
  changeNode: (node: TreeNode) => void;
  loadNode: () => void;
}

interface State {

}

class PageRouter extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {node: null};
  }

  componentDidMount() {
    this.props.loadNode();
  }

  changeNode = (node: TreeNode[]) => {
    this.setState({node});
  }

  render () {
    const { user, selectedNodeList, changeNode } = this.props;
    return (
      <Switch>
        <Route
          exact
          path={link.node}
          render={() => (
            <NodeNullChecker selectedNodeList={selectedNodeList} changeNode={changeNode}/>
          )}
        />
      </Switch>
  );
  }
} 

export default PageRouter;
