import * as React from 'react';
import TreeNode from '../../../data-types/tree-node';
import NodeList from './node-list';
import NodeViewer, { NodeViewProps } from './node-viewer';

interface Props {
  toolRef: HTMLDivElement | null;
  rightPaneRef: HTMLDivElement | null;
  treeNodes: TreeNode[] | null;
  selectedNodeList: TreeNode[] | null;
  changeNode: (node: TreeNode) => void;
  selectNode: (node: TreeNode | null) => void;
}

const NodeNullChecker: React.SFC<Props> = (props: Props) => {
  const { toolRef, rightPaneRef, treeNodes, selectedNodeList, changeNode, selectNode } = props;
  if (toolRef === null || selectedNodeList === null || treeNodes === null) {
    return <p>Now Loading..</p>;
  }
  if (selectedNodeList.length === 0) {
    return <NodeList treeNodes={treeNodes} selectNode={selectNode}/>;
  }

  const parent = selectedNodeList.length === 1 ? null : selectedNodeList[selectedNodeList.length - 2];

  const back = () => {
    const node = selectedNodeList.length !== 1 ? selectedNodeList[selectedNodeList.length - 2] : null;
    selectNode(node);
  }

  const viewerProps: NodeViewProps = {
    toolRef, rightPaneRef: rightPaneRef!,
    parentType: parent === null ? 'task' : parent.type,
    node: selectedNodeList[selectedNodeList.length - 1],
    back,
    changeNode,
  }
  
  return <NodeViewer {...viewerProps}/>;
};

export default NodeNullChecker;