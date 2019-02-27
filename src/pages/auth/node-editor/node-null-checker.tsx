import * as React from 'react';
import TreeNode from '../../../data-types/tree-node';
import NodeView from './node-view';

interface Props {
  selectedNodeList: TreeNode[] | null;
  changeNode: (node: TreeNode) => void;
}

const NodeNullChecker: React.SFC<Props> = (props: Props) => {
  const { selectedNodeList, changeNode } = props;
  if (selectedNodeList === null || selectedNodeList.length === 0) {
    return <p>Now Loading..</p>;
  }
  
  return <NodeView node={selectedNodeList[selectedNodeList.length - 1]} changeNode={changeNode}/>;
};

export default NodeNullChecker;