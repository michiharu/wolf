import * as React from 'react';
import TreeNode from '../../../data-types/tree-node';
import NodeViewer, { NodeViewProps } from './node-viewer';

interface Props {
  containerRef: HTMLDivElement | null;
  selectedNodeList: TreeNode[] | null;
}

const NodeNullChecker: React.SFC<Props> = (props: Props) => {
  const { containerRef, selectedNodeList } = props;
  if (containerRef === null || selectedNodeList === null) {
    return <p>Now Loading..</p>;
  }
  if (selectedNodeList.length === 0) { return <p>マニュアルを選択してください。</p>; }

  const parent = selectedNodeList.length === 1 ? null : selectedNodeList[selectedNodeList.length - 2];

  const viewerProps: NodeViewProps = {
    containerRef,
    parentType: parent === null ? 'task' : parent.type,
    node: selectedNodeList[selectedNodeList.length - 1]
  }
  
  return <NodeViewer {...viewerProps}/>;
};

export default NodeNullChecker;