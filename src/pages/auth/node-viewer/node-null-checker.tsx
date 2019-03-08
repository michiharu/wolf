import * as React from 'react';
import TreeNode from '../../../data-types/tree-node';
import NodeList from './node-list';
import NodeViewer, { NodeViewProps } from './node-viewer';

interface Props {
  containerRef: HTMLDivElement | null;
  treeNodes: TreeNode[] | null;
  selectedNodeList: TreeNode[] | null;
  selectNode: (node: TreeNode | null) => void;
}

const NodeNullChecker: React.SFC<Props> = (props: Props) => {
  const { containerRef, treeNodes, selectedNodeList, selectNode } = props;
  if (containerRef === null || selectedNodeList === null || treeNodes === null) {
    return <p>Now Loading..</p>;
  }
  if (selectedNodeList.length === 0) {
    return <NodeList containerRef={containerRef} treeNodes={treeNodes} selectNode={selectNode}/>;
  }

  const parent = selectedNodeList.length === 1 ? null : selectedNodeList[selectedNodeList.length - 2];

  const back = () => {
    const node = selectedNodeList.length !== 1 ? selectedNodeList[selectedNodeList.length - 2] : null;
    selectNode(node);
  }

  const viewerProps: NodeViewProps = {
    containerRef,
    parentType: parent === null ? 'task' : parent.type,
    node: selectedNodeList[selectedNodeList.length - 1],
    back
  }
  
  return <NodeViewer {...viewerProps}/>;
};

export default NodeNullChecker;