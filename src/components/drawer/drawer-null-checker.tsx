import * as React from 'react';
import TreeNode from '../../data-types/tree-node';
import Drawer from './drawer';

export interface DrawerNullCheckerProps {
  open: boolean;
  toggle: () => void;

  nodeList: TreeNode[] | null;
  selectedNodeList: TreeNode[] | null;
  selectNode: (node: TreeNode) => void;
  changeNode: (node: TreeNode) => void;
}

const DrawerNullChecker :React.SFC<DrawerNullCheckerProps> = (props: DrawerNullCheckerProps) => {
  const { open, toggle, nodeList, selectedNodeList, selectNode, changeNode } = props;
  if (nodeList === null || selectedNodeList === null) {
    return <p>Now Loading..</p>;
  }
  
  return (
    <Drawer
      open={open}
      toggle={toggle}
      nodeList={nodeList}
      selectedNodeList={selectedNodeList}
      selectNode={selectNode}
      changeNode={changeNode}/>
    );
};

export default DrawerNullChecker;