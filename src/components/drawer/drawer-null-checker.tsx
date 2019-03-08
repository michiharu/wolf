import * as React from 'react';
import TreeNode from '../../data-types/tree-node';
import Drawer from './drawer';

export interface DrawerNullCheckerProps {
  open: boolean;
  toggle: () => void;

  treeNodes: TreeNode[] | null;
  selectedNodeList: TreeNode[] | null;
  selectNode: (node: TreeNode) => void;
  changeNode: (node: TreeNode) => void;
}

const DrawerNullChecker :React.SFC<DrawerNullCheckerProps> = (props: DrawerNullCheckerProps) => {
  const { open, toggle, treeNodes, selectedNodeList, selectNode, changeNode } = props;
  if (treeNodes === null || selectedNodeList === null) {
    return <p>Now Loading..</p>;
  }
  
  return (
    <Drawer
      open={open}
      toggle={toggle}
      treeNodes={treeNodes}
      selectedNodeList={selectedNodeList}
      selectNode={selectNode}
      changeNode={changeNode}/>
    );
};

export default DrawerNullChecker;