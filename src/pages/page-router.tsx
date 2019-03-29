import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import TreeNode from '../data-types/tree-node';
import link from '../settings/path-list';
import EditorNullChecker from './node-editor/editor-null-checker';
import CheckListNullChecker from './check-list/check-list-null-checker';
import Dashboard from './dashboard/dashboard';

interface Props {
  toolRef: HTMLDivElement | null;
  rightPaneRef: HTMLDivElement | null;
  treeNodes: TreeNode[];
  selectedNodeList: TreeNode[] | null;

  changeNode: (node: TreeNode) => void;
  addNode: (node: TreeNode) => void;
  selectNode: (node: TreeNode | null) => void;
}

interface State {

}

class PageRouter extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {node: null};
  }

  render () {
    const {
      toolRef, rightPaneRef, treeNodes, selectedNodeList, changeNode, addNode, selectNode
    } = this.props;
    return (
      <Switch>
        <Route
          exact
          path={link.dashboard}
          render={props => (
            <Dashboard
              {...props}
              treeNodes={treeNodes}
              selectNode={selectNode}
              addNode={addNode}
            />
          )}
        />
        {treeNodes.length === 0 && <Redirect to={link.dashboard}/>}
        <Route
          exact
          path={link.edit}
          render={props => (
            <EditorNullChecker
              {...props}
              toolRef={toolRef}
              rightPaneRef={rightPaneRef}
              treeNodes={treeNodes}
              selectedNodeList={selectedNodeList}
              changeNode={changeNode}
              addNode={addNode}
              selectNode={selectNode}
            />
          )}
        />
        <Redirect to={link.dashboard}/>
      </Switch>
    );
  }
} 

export default PageRouter;
