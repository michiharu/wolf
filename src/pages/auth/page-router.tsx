import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import TreeNode from '../../data-types/tree-node';
import link from '../../settings/path-list';
import EditorNullChecker from './node-editor/editor-null-checker';
import CheckListNullChecker from './check-list/check-list-null-checker';

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
          path={link.check}
          render={() => (
            <CheckListNullChecker
              toolRef={toolRef}
              treeNodes={treeNodes}
              selectedNodeList={selectedNodeList}
              selectNode={selectNode}
            />
          )}
        />
        <Route
          exact
          path={link.edit}
          render={() => (
            <EditorNullChecker
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
        <Redirect to={link.check}/>
      </Switch>
    );
  }
} 

export default PageRouter;
