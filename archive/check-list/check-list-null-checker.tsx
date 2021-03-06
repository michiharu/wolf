import * as React from 'react';
import { TreeNode } from '../../src/data-types/tree';
import CheckList, { CheckListProps } from './check-list';

interface Props {
  toolRef: HTMLDivElement | null;
  treeNodes: TreeNode[] | null;
  selectedNodeList: TreeNode[] | null;
  selectNode: (node: TreeNode | null) => void;
}

const EditorNullChecker: React.SFC<Props> = (props: Props) => {
  const { toolRef, treeNodes, selectedNodeList, selectNode } = props;
  if (toolRef === null || selectedNodeList === null || treeNodes === null) {
    return <p>Now Loading..</p>;
  }

  const parent = selectedNodeList.length === 1 ? null : selectedNodeList[selectedNodeList.length - 2];

  const back = () => {
    const node = selectedNodeList.length !== 1 ? selectedNodeList[selectedNodeList.length - 2] : null;
    selectNode(node);
  }

  const viewerProps: CheckListProps = {
    toolRef,
    parent,
    node: selectedNodeList[selectedNodeList.length - 1],
    back,
  }
  
  return <CheckList {...viewerProps}/>;
};

export default EditorNullChecker;