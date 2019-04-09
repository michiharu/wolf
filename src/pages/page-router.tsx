import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import TreeNode from '../data-types/tree-node';
import link from '../settings/path-list';
import EditorNullChecker from './node-editor/editor-null-checker';
import Dashboard from './dashboard/dashboard';
import TextNullChecker from './text-editor/text-null-checker';

interface Props {
  toolRef: HTMLDivElement | null;
  rightPaneRef: HTMLDivElement | null;
  treeNodes: TreeNode[];
  selectedNodeList: TreeNode[];
  commonNodes: TreeNode[];

  changeNode: (node: TreeNode) => void;
  addNode: (node: TreeNode) => void;
  deleteNode: (node: TreeNode) => void;
  selectNode: (node: TreeNode | null) => void;
  addCommonList: (node: TreeNode) => void;
  deleteCommonList: (node: TreeNode) => void;
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
      toolRef, rightPaneRef, treeNodes, selectedNodeList, commonNodes,
      selectNode, changeNode, addNode, deleteNode, addCommonList, deleteCommonList,
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
              commonNodes={commonNodes}
              addNode={addNode}
              deleteNode={deleteNode}
              addCommonList={addCommonList}
              deleteCommonList={deleteCommonList}
            />
          )}
        />
        {selectedNodeList.length === 0 && <Redirect to={link.dashboard}/>}
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
              commonNodes={commonNodes}
              changeNode={changeNode}
              addNode={addNode}
              addCommonList={addCommonList}
              deleteCommonList={deleteCommonList}
            />
          )}
        />
        <Route
          exact
          path={link.text}
          render={props => (
            <TextNullChecker
              {...props}
              toolRef={toolRef}
              rightPaneRef={rightPaneRef}
              treeNodes={treeNodes}
              selectedNodeList={selectedNodeList}
              commonNodes={commonNodes}
              changeNode={changeNode}
              addNode={addNode}
              addCommonList={addCommonList}
              deleteCommonList={deleteCommonList}
            />
          )}
        />
        <Redirect to={link.dashboard}/>
      </Switch>
    );
  }
} 

export default PageRouter;
