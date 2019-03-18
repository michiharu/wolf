import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import TreeNode from '../../data-types/tree-node';
import link from '../../settings/path-list';
import EditorNullChecker from './node-editor/node-null-checker';
import ViewerNullChecker from './node-viewer/node-null-checker';

interface Props {
  toolRef: HTMLDivElement | null;
  rightPaneRef: HTMLDivElement | null;
  treeNodes: TreeNode[] | null;
  selectedNodeList: TreeNode[] | null;

  changeNode: (node: TreeNode) => void;
  loadNode: () => void;
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

  componentDidMount() {
    this.props.loadNode();
  }

  render () {
    const {
      toolRef, rightPaneRef, treeNodes, selectedNodeList, changeNode, addNode, selectNode
    } = this.props;
    return (
      <Switch>
        <Route
          exact
          path={link.edit}
          render={() => (
            <EditorNullChecker
              containerRef={toolRef}
              selectedNodeList={selectedNodeList}
              changeNode={changeNode}
              selectNode={selectNode}
            />
          )}
        />
        <Route
          exact
          path={link.view}
          render={() => (
            <ViewerNullChecker
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
      </Switch>
  );
  }
} 

export default PageRouter;
