import * as React from 'react';
import TreeNode from '../../../data-types/tree-node';
import NodeViewer from './node-viewer';

interface Props {
  containerRef: HTMLDivElement | null;
  node: TreeNode[] | null;
}

const NodeNullChecker: React.SFC<Props> = (props: Props) => {
  const { containerRef, node } = props;
  if (containerRef === null || node === null) {
    return <p>Now Loading..</p>;
  }
  if (node.length === 0) { return <p>マニュアルを選択してください。</p>; }
  
  return <NodeViewer containerRef={containerRef} node={node[0]}/>;
};

export default NodeNullChecker;