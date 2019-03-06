import * as React from 'react';
import TreeNode from '../../../data-types/tree-node';
import NodeEditorState from './node-editor-state';

interface Props {
  containerRef: HTMLDivElement | null;
  selectedNodeList: TreeNode[] | null;
  changeNode: (node: TreeNode) => void;
  selectNode: (node: TreeNode | null) => void;
}

const NodeNullChecker: React.SFC<Props> = (props: Props) => {
  const { containerRef, selectedNodeList, changeNode, selectNode } = props;
  if (containerRef === null) {
    return <p>Now Loading..</p>;
  }
  if (selectedNodeList === null || selectedNodeList.length === 0) {
    return <p>左のリストから編集するマニュアルを選択してください。</p>;
  }

  const back = () => {
    const node = selectedNodeList.length !== 1 ? selectedNodeList[selectedNodeList.length - 2] : null;
    selectNode(node);
  }
  
  return (
    <NodeEditorState
      containerRef={containerRef}
      node={selectedNodeList[selectedNodeList.length - 1]}
      changeNode={changeNode}
      back={back}
      selectNode={selectNode}
    />
  );
};

export default NodeNullChecker;