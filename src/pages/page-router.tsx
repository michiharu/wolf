import * as React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Tree, KTreeNode } from '../data-types/tree-node';
import link from '../settings/path-list';
import EditorStateManager from './editor/editor-state-manager';
import Dashboard from './dashboard/dashboard';

interface Props {
  treeNodes: Tree[];
  selectedNodeList: Tree[];
  commonNodes: Tree[];
  memoList: KTreeNode[];
  changeNode: (node: Tree) => void;
  addNode: (node: Tree) => void;
  deleteNode: (node: Tree) => void;
  selectNode: (node: Tree | null) => void;
  addCommonList: (node: Tree) => void;
  deleteCommonList: (node: Tree) => void;
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
      treeNodes, selectedNodeList, commonNodes, memoList,
      selectNode, changeNode, addNode, deleteNode, addCommonList, deleteCommonList,
    } = this.props;
    return (
      <BrowserRouter>
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
              <EditorStateManager
                {...props}
                treeNodes={treeNodes}
                selectedNodeList={selectedNodeList}
                commonNodes={commonNodes}
                memoList={memoList}
                changeNode={changeNode}
                addNode={addNode}
              />
            )}
          />
          <Redirect to={link.dashboard}/>
        </Switch>
      </BrowserRouter>
    );
  }
} 

export default PageRouter;
