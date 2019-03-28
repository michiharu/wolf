import * as React from 'react';
import TreeNode from '../../data-types/tree-node';
import NodeList from './node-list';
import NodeEditor, { EditorProps } from './node-editor';
import { RouteComponentProps } from 'react-router';
import link from '../../settings/path-list';

interface Props extends RouteComponentProps {
  toolRef: HTMLDivElement | null;
  rightPaneRef: HTMLDivElement | null;
  treeNodes: TreeNode[] | null;
  selectedNodeList: TreeNode[] | null;
  changeNode: (node: TreeNode) => void;
  addNode: (node: TreeNode) => void;
  selectNode: (node: TreeNode | null) => void;
}

const EditorNullChecker: React.SFC<Props> = (props: Props) => {
  const {
    toolRef, rightPaneRef, treeNodes, selectedNodeList, changeNode, selectNode, addNode, history
  } = props;
  if (toolRef === null || selectedNodeList === null || treeNodes === null) {
    return <p>Now Loading..</p>;
  }
  if (selectedNodeList.length === 0) {
    return <NodeList treeNodes={treeNodes} selectNode={selectNode} addNode={addNode}/>;
  }

  const parent = selectedNodeList.length === 1 ? null : selectedNodeList[selectedNodeList.length - 2];

  const back = () => {
    const node = selectedNodeList.length !== 1 ? selectedNodeList[selectedNodeList.length - 2] : null;
    selectNode(node);
    if (node === null) { history.push(link.dashboard) }
  }

  const viewerProps: EditorProps = {
    toolRef, rightPaneRef: rightPaneRef!,
    parent,
    node: selectedNodeList[selectedNodeList.length - 1],
    back,
    changeNode,
  }
  
  return <NodeEditor {...viewerProps}/>;
};

export default EditorNullChecker;